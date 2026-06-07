// api-gateway/src/routes/proxy.js
// Définit les routes proxy vers chaque microservice

const { Router } = require('express');
const proxy = require('express-http-proxy');
const config = require('../config');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

// Public auth endpoints proxied to user-service
router.use('/auth', proxy(config.services.user, {
  proxyReqPathResolver: (req) => `/api/auth${req.url}`,
  proxyErrorHandler: (err, res, next) => {
    console.error('[Gateway] Auth proxy error:', err.message);
    res.status(503).json({ success: false, error: 'User Service unavailable' });
  },
}));

// Protect certain user routes (GET, PUT, DELETE)
router.use('/users', (req, res, next) => {
  const protectedMethods = ['GET', 'PUT', 'DELETE'];
  if (protectedMethods.includes(req.method)) return protect()(req, res, next);
  return next();
}, proxy(config.services.user, {
  proxyReqPathResolver: (req) => `/api/users${req.url}`,
  proxyErrorHandler: (err, res, next) => {
    console.error('[Gateway] User Service unreachable:', err.message);
    res.status(503).json({ success: false, error: 'User Service unavailable' });
  },
}));

//    Proxy vers Product Service                                     
router.use('/products', proxy(config.services.product, {
  proxyReqPathResolver: (req) => `/api/products${req.url}`,
  proxyErrorHandler: (err, res, next) => {
    console.error('[Gateway] Product Service unreachable:', err.message);
    res.status(503).json({ success: false, error: 'Product Service unavailable' });
  },
}));

// Protect all order routes
router.use('/orders', protect(), proxy(config.services.order, {
  proxyReqPathResolver: (req) => `/api/orders${req.url}`,
  proxyErrorHandler: (err, res, next) => {
    console.error('[Gateway] Order Service unreachable:', err.message);
    res.status(503).json({ success: false, error: 'Order Service unavailable' });
  },
}));

module.exports = router;