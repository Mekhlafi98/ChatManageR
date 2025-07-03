const Contact = require('../../models/Contact');
const whatsappService = require('../../services/whatsappService');

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
    const userId = req.user.id;
    const client = whatsappService.getClient(userId);

    if (!client) {
      return res.status(400).json({ message: 'WhatsApp client not connected.' });
    }

    const contacts = await client.getContacts();
    let syncedCount = 0;

    for (const contact of contacts) {
      if (contact.isMyContact && !contact.isMe) {
        await Contact.findOneAndUpdate(
          { userId, whatsappId: contact.id._serialized },
          {
            name: contact.name || contact.pushname,
            number: contact.number,
            isBusiness: contact.isBusiness,
            isGroup: contact.isGroup,
            profilePicUrl: await contact.getProfilePicUrl() || null
          },
          { upsert: true, new: true }
        );
        syncedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Contacts synced successfully',
      syncedCount
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