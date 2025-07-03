const express = require('express');
const router = express.Router();
const { getContacts, syncContacts, searchContacts } = require('../controllers/contacts/contactsController');

router.get('/', getContacts);
router.post('/sync', syncContacts);
router.get('/search', searchContacts);

module.exports = router;