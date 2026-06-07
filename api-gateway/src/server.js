// api-gateway/src/server.js
// Point d'entrée de l'API Gateway

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const config = require('./config');
const logger = require('./logger');
const proxyRoutes = require('./routes/proxy');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

//    Middlewares globaux                                            
app.use(helmet()); // Security headers
app.use(cors({ origin: config.corsOrigin }));

// Rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: config.rateLimitMax });
app.use(limiter);

// Correlation ID
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
});

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim(), { correlationId: null }),
  },
}));
app.use(express.json());               // Parse le body JSON des requêtes

// Request timeout (ms)
const REQUEST_TIMEOUT_MS = config.requestTimeoutMs;
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT_MS, () => {
    logger.warn('Gateway request timed out', {
      method: req.method,
      url: req.url,
      timeoutMs: REQUEST_TIMEOUT_MS,
      correlationId: req.correlationId,
    });

    if (!res.headersSent) {
      res.status(504).json({ success: false, error: 'Gateway timeout' });
    }
  });
  next();
});

//    Routes                                                         
app.get('/', (req, res) => {
  res.json({
    message: ' API Gateway is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

app.use('/health', healthRoutes);      // Vérification de santé
app.use('/api', proxyRoutes);          // Proxy vers les microservices

//    Route 404                                                      
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

//    Gestion des erreurs globales                                   
app.use(errorHandler);

//    Démarrage du serveur                                           
const server = app.listen(config.port, () => {
  logger.info(`API Gateway running on http://localhost:${config.port}`, { service: config.serviceName });
  logger.info('Proxy targets loaded', {
    user: config.services.user,
    product: config.services.product,
    order: config.services.order,
  });
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal} - closing api-gateway`, { service: config.serviceName });
  server.close(() => {
    logger.info('API Gateway stopped', { service: config.serviceName });
  });

  setTimeout(() => {
    logger.error('Forcing shutdown', { service: config.serviceName });
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app; // Export pour les tests