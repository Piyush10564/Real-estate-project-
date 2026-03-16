const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const authMiddleware = require('../middleware/auth');

// Send an inquiry/message to seller
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { sellerId, propertyId, message, buyerPhone } = req.body;
    const buyerId = req.user.id;

    // Validate required fields
    if (!sellerId || !propertyId || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create inquiry
    const inquiry = new Inquiry({
      buyer: buyerId,
      seller: sellerId,
      property: propertyId,
      message: message,
      buyerContact: {
        phone: buyerPhone,
        email: req.user.email
      }
    });

    await inquiry.save();

    // Populate references for response
    await inquiry.populate('buyer', 'firstName lastName email phone');
    await inquiry.populate('seller', 'firstName lastName email phone');
    await inquiry.populate('property', 'title price');

    res.status(201).json({
      message: 'Inquiry sent successfully',
      inquiry: inquiry
    });
  } catch (error) {
    console.error('Error sending inquiry:', error);
    res.status(500).json({ message: 'Error sending inquiry', error: error.message });
  }
});

// Get all inquiries for the logged-in user (both sent and received)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const type = req.query.type; // 'sent' or 'received'

    let query = {};

    if (type === 'sent') {
      query = { buyer: userId };
    } else if (type === 'received') {
      query = { seller: userId };
    } else {
      // Get both
      query = {
        $or: [{ buyer: userId }, { seller: userId }]
      };
    }

    const inquiries = await Inquiry.find(query)
      .populate('buyer', 'firstName lastName email phone profileImage')
      .populate('seller', 'firstName lastName email phone profileImage')
      .populate('property', 'title price address city images')
      .sort({ createdAt: -1 });

    res.json({ inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
});

// Get a single inquiry
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('buyer', 'firstName lastName email phone profileImage')
      .populate('seller', 'firstName lastName email phone profileImage')
      .populate('property', 'title price address city images');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Check if user is authorized to view this inquiry
    if (inquiry.buyer._id.toString() !== req.user.id && inquiry.seller._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this inquiry' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ message: 'Error fetching inquiry', error: error.message });
  }
});

// Mark inquiry as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Only seller can mark as read
    if (inquiry.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this inquiry as read' });
    }

    inquiry.isRead = true;
    inquiry.updatedAt = Date.now();
    await inquiry.save();

    res.json({ message: 'Inquiry marked as read', inquiry });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ message: 'Error updating inquiry', error: error.message });
  }
});

// Delete an inquiry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Only buyer or seller can delete
    if (inquiry.buyer.toString() !== req.user.id && inquiry.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this inquiry' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
});

module.exports = router;
