// api-gateway/src/config/index.js
// Centralise toute la configuration de l'API Gateway

require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  serviceName: process.env.SERVICE_NAME || 'api-gateway',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : true,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS) || 10000,

  services: {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
  },
};