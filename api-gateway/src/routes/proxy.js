// api-gateway/src/routes/proxy.js
// Définit les routes proxy vers chaque microservice

const { Router } = require('express');
const proxy = require('express-http-proxy');
const config = require('../config');

const router = Router();

//    Proxy vers User Service                                        
// Toutes les requêtes /api/users/* sont redirigées vers user-service
router.use('/users', proxy(config.services.user, {
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

//    Proxy vers Order Service                                       
router.use('/orders', proxy(config.services.order, {
  proxyReqPathResolver: (req) => `/api/orders${req.url}`,
  proxyErrorHandler: (err, res, next) => {
    console.error('[Gateway] Order Service unreachable:', err.message);
    res.status(503).json({ success: false, error: 'Order Service unavailable' });
  },
}));

module.exports = router;