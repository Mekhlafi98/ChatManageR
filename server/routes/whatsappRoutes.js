const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const {
  getWhatsAppConnections,
  createWhatsAppConnection,
  updateWhatsAppConnection,
  connectWhatsAppConnection,
  disconnectWhatsAppConnection,
  deleteWhatsAppConnection,
  setActiveConnection,
  handleWebhook
} = require('../controllers/whatsapp/whatsappController');

// Apply authentication middleware to all routes
router.use(requireUser);

router.get('/connections', getWhatsAppConnections);
router.post('/connections', createWhatsAppConnection);
router.put('/connections/:connectionId', updateWhatsAppConnection);
router.post('/connections/:connectionId/connect', connectWhatsAppConnection);
router.post('/connections/:connectionId/disconnect', disconnectWhatsAppConnection);
router.delete('/connections/:connectionId', deleteWhatsAppConnection);
router.put('/connections/:connectionId/activate', setActiveConnection);
router.post('/webhook', handleWebhook);

module.exports = router;