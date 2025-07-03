const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markMessagesAsRead } = require('../controllers/messages/messagesController');

router.get('/:contactId', getMessages);
router.post('/', sendMessage);
router.put('/read', markMessagesAsRead);

module.exports = router;