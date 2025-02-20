const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');
const { generateToken } = require('../helpers/auth');

describe('PrescriberType Controller', () => {
  let adminToken, supervisorToken;

  beforeAll(async () => {
    adminToken = generateToken({ id: 1, role: 'admin' });
    supervisorToken = generateToken({ id: 2, role: 'supervisor' });
  });

  describe('GET /api/prescriber-types', () => {
    it('should return all prescriber types', async () => {
      const response = await request(app)
        .get('/api/prescriber-types')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/prescriber-types', () => {
    it('should create a new prescriber type as admin', async () => {
      const newType = {
        name: 'Test Type',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/prescriber-types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newType);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should create a new prescriber type as supervisor', async () => {
      const newType = {
        name: 'Supervisor Type',
        description: 'Created by supervisor'
      };

      const response = await request(app)
        .post('/api/prescriber-types')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send(newType);

      expect(response.status).toBe(201);
    });
  });
}); 