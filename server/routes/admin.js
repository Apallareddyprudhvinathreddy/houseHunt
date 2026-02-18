const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    const [userCount, propCount, bookingCount, reviewCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments()
    ]);
    const pendingOwners = await User.countDocuments({ role: 'Owner', isApproved: false });
    res.json({ userCount, propCount, bookingCount, reviewCount, pendingOwners });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    const users = await User.find().select('-password').limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/owners/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    const owners = await User.find({ role: 'Owner', isApproved: false }).select('-password');
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/owners/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'Owner') return res.status(404).json({ message: 'Owner not found' });
    user.isApproved = true;
    await user.save();
    res.json({ message: 'Owner approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
