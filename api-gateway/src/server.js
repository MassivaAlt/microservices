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
const requestLogger = require('./middlewares/requestLogger');
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
app.use(requestLogger);

// Request timeout (ms)
app.use((req, res, next) => {
  req.setTimeout(config.requestTimeoutMs, () => {
    logger.warn('Gateway request timed out', {
      method: req.method,
      url: req.url,
      timeoutMs: config.requestTimeoutMs,
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
    message: 'API Gateway is running',
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

module.exports = app; // Export pour les tests