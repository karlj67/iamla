const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');
const { generateToken } = require('../helpers/auth');

describe('Auth Controller', () => {
  let adminToken, visitorToken;

  beforeAll(() => {
    adminToken = generateToken({ id: 1, role: 'admin' });
    visitorToken = generateToken({ id: 2, role: 'medical_visitor' });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'admin@rycapharma.com',
        password: 'Admin@2024'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const credentials = {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'Test@2024',
        first_name: 'Test',
        last_name: 'User',
        role: 'medical_visitor'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId');
    });

    it('should reject duplicate email', async () => {
      const duplicateUser = {
        email: 'admin@rycapharma.com',
        password: 'Test@2024',
        first_name: 'Test',
        last_name: 'User',
        role: 'medical_visitor'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Déconnexion réussie');
    });
  });

  describe('Token Validation', () => {
    it('should reject invalid token format', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'InvalidToken');

      expect(response.status).toBe(401);
    });

    it('should reject expired token', async () => {
      const expiredToken = generateToken(
        { id: 1, role: 'admin' },
        { expiresIn: '0s' }
      );

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Role Authorization', () => {
    it('should allow admin access to protected route', async () => {
      const response = await request(app)
        .get('/api/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('should deny visitor access to admin route', async () => {
      const response = await request(app)
        .get('/api/stats/admin')
        .set('Authorization', `Bearer ${visitorToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Accès non autorisé');
    });
  });

  // Nettoyage après les tests
  afterAll(async () => {
    // Supprimer l'utilisateur de test
    await db.query('DELETE FROM users WHERE email = ?', ['test@example.com']);
  });
}); 