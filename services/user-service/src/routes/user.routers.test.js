
const request = require('supertest');
const app = require('../server');

describe('User Service CRUD', () => {
  let createdUserId;

  it('GET /api/users —retourne la liste des users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/users -crée un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe('test@example.com');
    createdUserId = res.body.data.id;
  });

  it('GET /api/users/:id — récupère un user par id', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdUserId);
  });

  it('PUT /api/users/:id — met à jour un user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({ name: 'Updated Name' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
  });

  it('DELETE /api/users/:id — supprime un user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/users/:id — retourne 404 si non trouvé', async () => {
    const res = await request(app).get('/api/users/nonexistent-id');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/users — retourne 400 si champs manquants', async () => {
    const res = await request(app).post('/api/users').send({ name: 'No Email' });
    expect(res.statusCode).toBe(400);
  });
});