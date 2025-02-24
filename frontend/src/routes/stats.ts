const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Route pour les stats globales (doit être avant les routes spécifiques)
router.get('/', auth, statsController.getStats);

// Routes pour les statistiques
router.get('/monthly', auth, statsController.getMonthlyStats);
router.get('/prescriber-types', auth, statsController.getPrescriberTypeStats);
router.post('/objectives', 
  auth, 
  checkRole(['admin', 'supervisor']), 
  statsController.setMonthlyObjectives
);

module.exports = router; 
