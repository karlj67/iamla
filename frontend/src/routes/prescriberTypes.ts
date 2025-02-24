const express = require('express');
const router = express.Router();
const prescriberTypeController = require('../controllers/prescriberTypeController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/', auth, prescriberTypeController.getAll);
router.post('/', 
  auth, 
  checkRole(['admin', 'supervisor']), 
  prescriberTypeController.create
);
router.put('/:id', 
  auth, 
  checkRole(['admin', 'supervisor']), 
  prescriberTypeController.update
);

module.exports = router; 
