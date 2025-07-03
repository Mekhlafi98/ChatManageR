const Contact = require('../models/Contact');

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.status(200).json({ contacts });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const syncContacts = async (req, res) => {
  try {
    // TODO: Implement contact syncing logic
    res.status(200).json({
      success: true,
      message: 'Contacts synced successfully',
      syncedCount: 0
    });
  } catch (error) {
    console.error('Error syncing contacts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchContacts = async (req, res) => {
  try {
    const { query } = req.query;
    const contacts = await Contact.find({
      userId: req.user.id,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json({ contacts });
  } catch (error) {
    console.error('Error searching contacts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getContacts, syncContacts, searchContacts };
