import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
const { checkRole } = require('../middleware/roleCheck');
const auth = require('../middleware/auth');

const router = Router();

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

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/register', AuthController.register);

export default router; 
