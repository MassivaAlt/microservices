// api-gateway/src/routes/health.js
// Endpoint de santé : vérifie que le Gateway et les services sont up

const { Router } = require('express');
const axios = require('axios');
const config = require('../config');

const router = Router();

// Vérifie la disponibilité d'un service et retourne son statut
const checkService = async (name, url) => {
  try {
    const response = await axios.get(`${url}/health`, { timeout: 3000 });
    return { name, status: 'up', url };
  } catch {
    return { name, status: 'down', url };
  }
};

// GET /health — santé du gateway + de tous les services
router.get('/', async (req, res) => {
  const checks = await Promise.all([
    checkService('user-service', config.services.user),
    checkService('product-service', config.services.product),
    checkService('order-service', config.services.order),
  ]);

  const allUp = checks.every((s) => s.status === 'up');

  res.status(allUp ? 200 : 207).json({
    gateway: 'up',
    timestamp: new Date().toISOString(),
    services: checks,
  });
});

module.exports = router;