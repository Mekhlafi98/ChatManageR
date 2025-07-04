const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const { getMessages, sendMessage, markMessagesAsRead } = require('../controllers/messages/messagesController');

// Apply authentication middleware to all routes
router.use(requireUser);

router.get('/:contactId', getMessages);
router.post('/', sendMessage);
router.put('/read', markMessagesAsRead);

module.exports = router;