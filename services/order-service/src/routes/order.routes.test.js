const request = require('supertest');
const app = require('../server');

describe('Order Service CRUD', () => {
  let createdOrderId;

  it('GET /api/orders — retourne la liste des commandes', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/orders — crée une commande', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ userId: 'user-123', productId: 'product-123', quantity: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.userId).toBe('user-123');
    createdOrderId = res.body.data.id;
  });

  it('GET /api/orders/:id — récupère la commande', async () => {
    const res = await request(app).get(`/api/orders/${createdOrderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdOrderId);
  });

  it('PUT /api/orders/:id — met à jour la commande', async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}`)
      .send({ status: 'completed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('DELETE /api/orders/:id — supprime la commande', async () => {
    const res = await request(app).delete(`/api/orders/${createdOrderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/orders/:id — retourne 404 si non trouvé', async () => {
    const res = await request(app).get('/api/orders/nonexistent-id');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/orders — retourne 400 si champs manquants', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ userId: 'user-123', productId: 'product-123' });

    expect(res.statusCode).toBe(400);
  });
});
