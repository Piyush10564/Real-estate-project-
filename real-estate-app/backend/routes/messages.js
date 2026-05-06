const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// Get message history for an inquiry
router.get('/inquiry/:inquiryId', authMiddleware, async (req, res) => {
  try {
    const { inquiryId } = req.params;

    const messages = await Message.find({ inquiry: inquiryId })
      .populate('sender', 'firstName lastName profileImage')
      .populate('recipient', 'firstName lastName profileImage')
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Mark all messages as read for an inquiry
router.patch('/inquiry/:inquiryId/read', authMiddleware, async (req, res) => {
  try {
    const { inquiryId } = req.params;

    await Message.updateMany(
      { inquiry: inquiryId, recipient: req.userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read', error: error.message });
  }
});

module.exports = router;
