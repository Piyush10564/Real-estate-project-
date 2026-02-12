const express = require('express');
const Favorite = require('../models/Favorite');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get user's favorites
router.get('/', authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.userId })
      .populate('property')
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to favorites
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Check if already favorited
    const existing = await Favorite.findOne({ user: req.userId, property: propertyId });
    if (existing) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    const favorite = new Favorite({
      user: req.userId,
      property: propertyId
    });

    await favorite.save();
    await favorite.populate('property');

    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:propertyId', authMiddleware, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.userId,
      property: req.params.propertyId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
