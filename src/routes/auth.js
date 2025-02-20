const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkRole } = require('../middleware/roleCheck');
const auth = require('../middleware/auth');

// Route de test pour /api/auth
router.get('/', (req, res) => {
  res.json({ 
    message: 'Auth API is working',
    endpoints: {
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      register: 'POST /api/auth/register'
    }
  });
});

// Route de test pour /api/auth/login
router.get('/login', (req, res) => {
  res.json({ 
    message: 'Please use POST method for login',
    example: {
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'user@example.com',
        password: 'yourpassword'
      }
    }
  });
});

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);

module.exports = router; 