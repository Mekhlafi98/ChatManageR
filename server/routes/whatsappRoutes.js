const express = require('express');
const router = express.Router();
const {
  getWhatsAppConnections,
  createWhatsAppConnection,
  updateWhatsAppConnection,
  connectWhatsAppConnection,
  disconnectWhatsAppConnection,
  deleteWhatsAppConnection,
  setActiveConnection
} = require('../controllers/whatsapp/whatsappController');

router.get('/connections', getWhatsAppConnections);
router.post('/connections', createWhatsAppConnection);
router.put('/connections/:connectionId', updateWhatsAppConnection);
router.post('/connections/:connectionId/connect', connectWhatsAppConnection);
router.post('/connections/:connectionId/disconnect', disconnectWhatsAppConnection);
router.delete('/connections/:connectionId', deleteWhatsAppConnection);
router.put('/connections/:connectionId/activate', setActiveConnection);

module.exports = router;