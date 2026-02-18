const express = require('express');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, type, page = 1, limit = 20 } = req.query;
    const filter = { isPublished: true };

    if (city) filter['location.city'] = new RegExp(city, 'i');

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (type) {
      const types = type.split(',').map(s => s.trim()).filter(Boolean);
      if (types.length === 1) filter.propertyType = types[0];
      else filter.propertyType = { $in: types };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const query = Property.find(filter).populate('ownerId', 'name email').skip(skip).limit(Number(limit));
    const [items, total] = await Promise.all([query.exec(), Property.countDocuments(filter)]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id).populate('ownerId', 'name email');
    if (!prop) return res.status(404).json({ message: 'Not found' });
    res.json(prop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Owner') return res.status(403).json({ message: 'Only owners can add properties' });
    if (!req.user.isApproved) return res.status(403).json({ message: 'Owner not approved' });
    const data = req.body;
    const prop = await Property.create({ ...data, ownerId: req.user._id });
    res.status(201).json(prop);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const props = await Property.find({ ownerId: req.user._id });
    res.json(props);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });
    if (prop.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(prop, req.body);
    await prop.save();
    res.json(prop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });
    if (prop.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    await Property.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
