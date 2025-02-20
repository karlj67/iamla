const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Route pour mettre à jour la position
router.post('/update', 
  auth, 
  checkRole(['medical_visitor']), 
  locationController.updateLocation
);

// Route pour obtenir les positions actuelles
router.get('/current', 
  auth, 
  checkRole(['admin', 'supervisor']), 
  locationController.getCurrentLocations
);

// Route pour obtenir l'historique des positions
router.get('/history', 
  auth, 
  checkRole(['admin', 'supervisor']), 
  locationController.getLocationHistory
);

module.exports = router; 