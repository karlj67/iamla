const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');
const { generateToken } = require('../helpers/auth');

describe('Location Controller', () => {
  let visitorToken, supervisorToken;

  beforeAll(async () => {
    visitorToken = generateToken({ id: 3, role: 'medical_visitor', team_id: 1 });
    supervisorToken = generateToken({ id: 2, role: 'supervisor', team_id: 1 });
  });

  describe('POST /api/locations/update', () => {
    it('should update visitor location', async () => {
      const locationData = {
        latitude: 5.3484,
        longitude: -4.0305
      };

      const response = await request(app)
        .post('/api/locations/update')
        .set('Authorization', `Bearer ${visitorToken}`)
        .send(locationData);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/locations/current', () => {
    it('should get current locations for supervisor team', async () => {
      const response = await request(app)
        .get('/api/locations/current')
        .set('Authorization', `Bearer ${supervisorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 