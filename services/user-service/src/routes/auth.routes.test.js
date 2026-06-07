const request = require('supertest');
const app = require('../server');

jest.mock('../services/auth.service', () => ({
  register: jest.fn(async (data) => ({ id: 'new-user-1', name: data.name, email: data.email })),
  login: jest.fn(async (data) => 'mocked.jwt.token'),
}));

describe('Auth routes', () => {
  it('POST /api/auth/register returns 201 and user', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'New', email: 'new@mail.com', password: 'pass' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe('new@mail.com');
  });

  it('POST /api/auth/login returns token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'existing@example.com', password: 'pass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('mocked.jwt.token');
  });
});
