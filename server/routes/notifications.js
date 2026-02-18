const express = require('express');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(200);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    const note = await Notification.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (note.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    note.read = true;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
