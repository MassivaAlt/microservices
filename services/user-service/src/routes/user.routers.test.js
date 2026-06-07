const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

//  On simule complètement le comportement du UserService pour éviter de toucher à la vraie BDD
jest.mock('../services/user.service', () => {
  return {
    getAllUsers: jest.fn().mockResolvedValue([
      { id: 'user-123', name: 'Existing User', email: 'existing@example.com' }
    ]),
    getUserById: jest.fn((id) => {
      if (id === 'nonexistent-id') return null;
      return { id, name: 'Test User', email: 'test@example.com' };
    }),
    createUser: jest.fn((data) => {
      // Si l'email ou le nom est manquant, on simule une erreur de validation
      if (!data.name || !data.email) {
        const error = new Error('Validation Failed: Name and Email are required');
        error.status = 400; // On lui donne un statut 400
        throw error;
      }
      return { id: 'mocked-uuid-456', ...data };
    }),
    updateUser: jest.fn((id, data) => {
      return { id, name: data.name || 'Test User', email: 'test@example.com' };
    }),
    deleteUser: jest.fn().mockResolvedValue(true)
  };
});

describe('User Service CRUD', () => {
  let createdUserId = 'mocked-uuid-456'; // ID simulé pour la suite des tests
  const TEST_SECRET = 'testsecret';
  let authToken;

  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    authToken = jwt.sign({ id: 'user-123', email: 'existing@example.com', name: 'Existing User' }, TEST_SECRET);
  });

  it('GET /api/users —retourne la liste des users', async () => {
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/users -crée un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test User', email: 'test@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe('test@example.com');
  });

  it('GET /api/users/:id — récupère un user par id', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdUserId);
  });

  it('PUT /api/users/:id — met à jour un user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Name' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
  });

  it('DELETE /api/users/:id — supprime un user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ATTENTION ICI : Ton contrôleur doit renvoyer un 404 si le service renvoie null ou undefined !
  it('GET /api/users/:id — retourne 404 si non trouvé', async () => {
    const res = await request(app).get('/api/users/nonexistent-id').set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/users — retourne 400 si champs manquants', async () => {
    const res = await request(app)
    .post('/api/users')
    .set('Authorization', `Bearer ${authToken}`)

    .send({ name: 'No Email' });
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/users — without token returns 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/users — with invalid token returns 403', async () => {
    const res = await request(app).get('/api/users').set('Authorization', 'Bearer invalid.token');
    expect(res.statusCode).toBe(403);
  });
});