const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
    res.json({ reviews, avgRating, count: reviews.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Renter') return res.status(403).json({ message: 'Only renters can review' });
    const { propertyId, rating, title, text } = req.body;
    const review = await Review.create({ propertyId, userId: req.user._id, rating, title, text });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    review.helpful = (review.helpful || 0) + 1;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
