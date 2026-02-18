const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mailer = require('../utils/mailer');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Renter') return res.status(403).json({ message: 'Only renters can book' });
    const { propertyId, message } = req.body;
    const prop = await Property.findById(propertyId);
    if (!prop) return res.status(404).json({ message: 'Property not found' });
    const booking = await Booking.create({ propertyId, renterId: req.user._id, message });

    try {
      await Notification.create({
        userId: prop.ownerId,
        type: 'booking',
        referenceId: booking._id,
        message: `New inquiry from ${req.user.name} for ${prop.title}`
      });
    } catch (e) {
      console.error('Notification create failed', e.message);
    }

    try {
      const io = req.app.get('io');
      if (io) {
        io.to(prop.ownerId.toString()).emit('notification', {
          message: `New inquiry from ${req.user.name} for ${prop.title}`,
          bookingId: booking._id,
          createdAt: new Date()
        });
      }
    } catch (e) { console.error('Emit failed', e.message); }

    try {
      const owner = await User.findById(prop.ownerId);
      if (owner && owner.email) {
        await mailer.sendMail({
          to: owner.email,
          subject: `New inquiry for ${prop.title}`,
          text: `You have a new inquiry from ${req.user.name}: ${message || 'No message provided'}`
        });
      }
    } catch (e) { console.error('Email send failed', e.message); }

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ renterId: req.user._id }).populate('propertyId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/owner', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Owner') return res.status(403).json({ message: 'Only owners' });
    const props = await Property.find({ ownerId: req.user._id }).select('_id');
    const propIds = props.map(p => p._id);
    const bookings = await Booking.find({ propertyId: { $in: propIds } }).populate('renterId', 'name email').populate('propertyId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Owner') return res.status(403).json({ message: 'Only owners' });
    const booking = await Booking.findById(req.params.id).populate('propertyId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.propertyId.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    booking.status = 'approved';
    await booking.save();

    try {
      await Notification.create({ userId: booking.renterId, type: 'booking', referenceId: booking._id, message: `Your booking for ${booking.propertyId.title} was approved` });
      const io = req.app.get('io');
      if (io) io.to(booking.renterId.toString()).emit('notification', { message: `Your booking for ${booking.propertyId.title} was approved`, bookingId: booking._id });
    } catch (e) { console.error('Notify renter failed', e.message); }

    try {
      const renter = await User.findById(booking.renterId);
      if (renter && renter.email) {
        await mailer.sendMail({ to: renter.email, subject: 'Booking approved', text: `Your booking for ${booking.propertyId.title} has been approved.` });
      }
    } catch (e) { console.error('Email renter failed', e.message); }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
