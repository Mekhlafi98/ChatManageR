const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const { getContacts, createContact, syncContacts, searchContacts, checkContactExists } = require('../controllers/contacts/contactsController');

// Apply authentication middleware to all routes
router.use(requireUser);

router.get('/', getContacts);
router.post('/', createContact);
router.post('/sync', syncContacts);
router.get('/search', searchContacts);
router.get('/check/:phone', checkContactExists);

module.exports = router;