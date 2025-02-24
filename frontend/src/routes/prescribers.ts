const express = require('express');
const router = express.Router();
const prescriberController = require('../controllers/prescriberController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/', auth, prescriberController.getAllPrescribers);
router.get('/type/:typeId', auth, prescriberController.getPrescribersByType);
router.post('/', auth, checkRole(['admin', 'supervisor']), prescriberController.createPrescriber);
router.put('/:id', auth, checkRole(['admin', 'supervisor']), prescriberController.updatePrescriber);

module.exports = router; 
