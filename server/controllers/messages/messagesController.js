// const Message = require('../models/Message');
const Message = require('../../models/Message');
const mongoose = require('mongoose');

const getMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Validate contactId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const messages = await Message.find({ contactId, userId: req.user.id })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ contactId, userId: req.user.id });
    const hasMore = totalMessages > page * limit;

    res.status(200).json({ messages, hasMore });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { contactId, content, messageType = 'text' } = req.body;

    // Validate contactId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const message = new Message({
      contactId,
      content,
      messageType,
      isOutgoing: true,
      userId: req.user.id,
    });

    await message.save();

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { contactId, messageIds } = req.body;

    // Validate contactId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    await Message.updateMany(
      { _id: { $in: messageIds }, contactId, userId: req.user.id },
      { status: 'read' }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getMessages, sendMessage, markMessagesAsRead };
