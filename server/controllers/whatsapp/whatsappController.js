const WhatsAppConnection = require('../models/WhatsAppConnection');

const getWhatsAppConnections = async (req, res) => {
  try {
    const connections = await WhatsAppConnection.find({ userId: req.user.id });
    const activeConnection = connections.find(c => c.isDefault);
    res.status(200).json({ connections, activeConnectionId: activeConnection?._id });
  } catch (error) {
    console.error('Error getting WhatsApp connections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createWhatsAppConnection = async (req, res) => {
  try {
    const { name, webhookUrl, webhookEvents, signalsEnabled, signalConfig } = req.body;

    const connection = new WhatsAppConnection({
      name,
      webhookUrl,
      webhookEvents,
      signalsEnabled,
      signalConfig,
      userId: req.user.id,
    });

    await connection.save();

    res.status(201).json({ success: true, connection, message: 'Connection created successfully.' });
  } catch (error) {
    console.error('Error creating WhatsApp connection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateWhatsAppConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { name, webhookUrl, webhookEvents, signalsEnabled, signalConfig } = req.body;

    const connection = await WhatsAppConnection.findOneAndUpdate(
      { _id: connectionId, userId: req.user.id },
      { name, webhookUrl, webhookEvents, signalsEnabled, signalConfig },
      { new: true }
    );

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    res.status(200).json({ success: true, connection, message: 'Connection updated successfully.' });
  } catch (error) {
    console.error('Error updating WhatsApp connection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const connectWhatsAppConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    // TODO: Implement WhatsApp connection logic
    res.status(200).json({ success: true, message: 'Not implemented' });
  } catch (error) {
    console.error('Error connecting WhatsApp connection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const disconnectWhatsAppConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    // TODO: Implement WhatsApp disconnection logic
    res.status(200).json({ success: true, message: 'Not implemented' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp connection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteWhatsAppConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await WhatsAppConnection.findOneAndDelete({ _id: connectionId, userId: req.user.id });

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    res.status(200).json({ success: true, message: 'Connection deleted successfully.' });
  } catch (error) {
    console.error('Error deleting WhatsApp connection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const setActiveConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    await WhatsAppConnection.updateMany({ userId: req.user.id }, { isDefault: false });
    await WhatsAppConnection.updateOne({ _id: connectionId, userId: req.user.id }, { isDefault: true });

    res.status(200).json({ success: true, message: 'Active connection set successfully.' });
  } catch (error) {
    console.error('Error setting active connection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getWhatsAppConnections,
  createWhatsAppConnection,
  updateWhatsAppConnection,
  connectWhatsAppConnection,
  disconnectWhatsAppConnection,
  deleteWhatsAppConnection,
  setActiveConnection
};
