const request = require('supertest');
const app = require('../src/app');

describe('Web Application Tests', () => {

  describe('GET /', () => {
    it('should return the home page with status 200', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('DevOps CI/CD Pipeline Demo');
    });

    it('should contain pipeline stages', async () => {
      const res = await request(app).get('/');
      expect(res.text).toContain('Checkout');
      expect(res.text).toContain('Deploy');
    });
  });

  describe('GET /health', () => {
    it('should return health status 200', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });

    it('should include uptime and timestamp', async () => {
      const res = await request(app).get('/health');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /api/info', () => {
    it('should return application info as JSON', async () => {
      const res = await request(app).get('/api/info');
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('devops-cicd-pipeline');
    });

    it('should include system information', async () => {
      const res = await request(app).get('/api/info');
      expect(res.body).toHaveProperty('nodeVersion');
      expect(res.body).toHaveProperty('platform');
      expect(res.body).toHaveProperty('architecture');
    });
  });

  describe('GET /unknown-route', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/this-does-not-exist');
      expect(res.statusCode).toBe(404);
    });
  });

});
