const request = require('supertest');
const app = require('../server');

// On simule le ProductService pour éviter de toucher à la BDD pendant les tests unitaires
jest.mock('../services/product.service', () => {
  return {
    getAllProducts: jest.fn().mockResolvedValue([
      { id: 'mocked-prod-uuid', name: 'Keyboard', price: 49.99, description: 'Mechanical keyboard' }
    ]),
    getProductById: jest.fn((id) => {
      if (id === 'nonexistent-id') return null;
      return { id, name: 'Keyboard', price: 49.99, description: 'Mechanical keyboard' };
    }),
    createProduct: jest.fn((data) => {
      // Validation du mock : si le nom ou le prix est manquant, on lève une erreur 400
      if (!data.name || !data.price) {
        const error = new Error('Name and price are required');
        error.status = 400;
        throw error;
      }
      return { id: 'mocked-prod-uuid', ...data };
    }),
    updateProduct: jest.fn((id, data) => {
      return { id, name: 'Keyboard', price: data.price || 49.99, description: 'Mechanical keyboard' };
    }),
    deleteProduct: jest.fn().mockResolvedValue(true)
  };
});

describe('Product Service CRUD', () => {
  let createdProductId = 'mocked-prod-uuid'; // On initialise avec l'ID simulé pour sécuriser la suite du flux

  it('GET /api/products — retourne la liste des produits', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/products — crée un nouveau produit', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Keyboard', price: 49.99, description: 'Mechanical keyboard' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('Keyboard');
    expect(res.body.data.price).toBe(49.99);
    createdProductId = res.body.data.id;
  });

  it('GET /api/products/:id — récupère le produit créé', async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdProductId);
  });

  it('PUT /api/products/:id — met à jour le produit', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .send({ price: 39.99 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(39.99);
  });

  it('DELETE /api/products/:id — supprime le produit', async () => {
    const res = await request(app).delete(`/api/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/products/:id — retourne 404 si non trouvé', async () => {
    const res = await request(app).get('/api/products/nonexistent-id');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/products — retourne 400 si champs manquants', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Incomplete Product' });

    expect(res.statusCode).toBe(400);
  });
});