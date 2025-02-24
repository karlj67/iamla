const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.post('/', 
  auth, 
  checkRole(['admin']), 
  teamController.createTeam
);

router.get('/:teamId/members', 
  auth, 
  checkRole(['admin', 'supervisor']), 
  teamController.getTeamMembers
);

router.put('/:id', 
  auth, 
  checkRole(['admin']), 
  teamController.updateTeam
);

module.exports = router; 
