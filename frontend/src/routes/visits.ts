const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Routes pour les visiteurs
router.get('/upcoming', 
  auth, 
  checkRole(['medical_visitor']), 
  visitController.getUpcomingVisits
);

router.post('/:visitId/execute', 
  auth, 
  checkRole(['medical_visitor']), 
  visitController.executeVisit
);

router.get('/stats', 
  auth, 
  checkRole(['medical_visitor']), 
  visitController.getVisitorStats
);

module.exports = router; 
