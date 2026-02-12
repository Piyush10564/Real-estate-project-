const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
