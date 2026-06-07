const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken'); 


jest.mock('../services/order.service', () => {
  return {
    getAllOrders: jest.fn().mockResolvedValue([
      { id: 'mocked-order-uuid', userId: 'user-123', productId: 'product-123', quantity: 2, status: 'pending' }
    ]),
    getOrderById: jest.fn((id) => {
      if (id === 'nonexistent-id') return null;
      return { id, userId: 'user-123', productId: 'product-123', quantity: 2, status: 'pending' };
    }),
    createOrder: jest.fn((data) => {
      
      if (!data.userId || !data.productId || !data.quantity) {
        const error = new Error('UserId, productId and quantity are required');
        error.status = 400;
        throw error;
      }
      return { id: 'mocked-order-uuid', status: 'pending', ...data };
    }),
    updateOrder: jest.fn((id, data) => {
      return { id, userId: 'user-123', productId: 'product-123', quantity: 2, status: data.status || 'pending' };
    }),
    deleteOrder: jest.fn().mockResolvedValue(true)
  };
});

describe('Order Service CRUD', () => {
  let createdOrderId = 'mocked-order-uuid'; 
  const TEST_SECRET = 'ma_super_cle_secrete_miage';
  let authToken;

  
  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    authToken = jwt.sign({ id: 'user-123', email: 'test@example.com' }, TEST_SECRET);
  });

  it('GET /api/orders — retourne la liste des commandes', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`); 
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/orders — crée une commande', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`) 
      .send({ userId: 'user-123', productId: 'product-123', quantity: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.userId).toBe('user-123');
    createdOrderId = res.body.data.id;
  });

  it('GET /api/orders/:id — récupère la commande', async () => {
    const res = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${authToken}`); 
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdOrderId);
  });

  it('PUT /api/orders/:id — met à jour la commande', async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${authToken}`) 
      .send({ status: 'completed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('DELETE /api/orders/:id — supprime la commande', async () => {
    const res = await request(app)
      .delete(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${authToken}`); 
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/orders/:id — retourne 404 si non trouvé', async () => {
    const res = await request(app)
      .get('/api/orders/nonexistent-id')
      .set('Authorization', `Bearer ${authToken}`); 
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/orders — retourne 400 si champs manquants', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`) 
      .send({ userId: 'user-123', productId: 'product-123' });

    expect(res.statusCode).toBe(400);
  });

  
  it('GET /api/orders — retourne 401 si aucun token n\'est fourni', async () => {
    const res = await request(app).get('/api/orders'); 
    expect(res.statusCode).toBe(401);
  });
});