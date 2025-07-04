const mongoose = require('mongoose');

const whatsAppConnectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: String,
  isConnected: {
    type: Boolean,
    default: false,
  },
  qrCode: String,
  sessionStatus: {
    type: String,
    enum: ['disconnected', 'connecting', 'connected', 'qr_required', 'CONNECTED', 'CONNECTING', 'DISCONNECTED'],
    default: 'disconnected',
  },
  lastConnected: Date,
  isDefault: {
    type: Boolean,
    default: false,
  },
  webhookUrl: String,
  webhookEvents: [String],
  signalsEnabled: {
    type: Boolean,
    default: false,
  },
  signalConfig: {
    onMessage: Boolean,
    onAck: Boolean,
    onPresence: Boolean,
    onCall: Boolean,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const WhatsAppConnection = mongoose.model('WhatsAppConnection', whatsAppConnectionSchema);

module.exports = WhatsAppConnection;
