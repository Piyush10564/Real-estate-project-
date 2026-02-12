const express = require('express');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get reviews for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('reviewer', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({
      reviews,
      averageRating: avgRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { property, rating, comment, reviewType } = req.body;

    const review = new Review({
      property,
      reviewer: req.userId,
      rating,
      comment,
      reviewType: reviewType || 'property'
    });

    await review.save();
    await review.populate('reviewer', 'firstName lastName profileImage');

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
