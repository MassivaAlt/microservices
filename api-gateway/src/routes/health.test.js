// api-gateway/src/routes/health.test.js
const request = require('supertest');
const app = require('../server');

describe('API Gateway', () => {
  it('GET / — retourne les infos du gateway', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/API Gateway/);
  });

  it('GET /health — retourne le statut du gateway', async () => {
    const res = await request(app).get('/health');
    expect(res.body.gateway).toBe('up');
    expect(res.body.services).toHaveLength(3);
  });

  it('GET /unknown — retourne 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
  });
});