// api-gateway/src/server.js
// Point d'entrée de l'API Gateway

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const config = require('./config');
const proxyRoutes = require('./routes/proxy');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

//    Middlewares globaux                                            
app.use(helmet()); // Security headers

// CORS: default to permissive unless CORS_ORIGIN env provided
const corsOptions = {};
if (process.env.CORS_ORIGIN) {
  corsOptions.origin = process.env.CORS_ORIGIN.split(',');
} else {
  corsOptions.origin = true;
}
app.use(cors(corsOptions));                        // Autorise les requêtes cross-origin

// Rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: Number(process.env.RATE_LIMIT_MAX) || 100 });
app.use(limiter);

// Correlation ID
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
});

app.use(morgan('combined'));                 // Logs HTTP dans le terminal
app.use(express.json());               // Parse le body JSON des requêtes

// Request timeout (ms)
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS) || 10000;
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT_MS, () => {
    console.warn(`[Gateway] request timed out after ${REQUEST_TIMEOUT_MS}ms - ${req.method} ${req.url}`);
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
  console.log(`\n API Gateway running on http://localhost:${config.port}`);
  console.log(`  Proxying to:`);
  console.log(`   Users    → ${config.services.user}`);
  console.log(`   Products → ${config.services.product}`);
  console.log(`   Orders   → ${config.services.order}\n`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal} - closing api-gateway`);
  server.close(() => {
    console.log('API Gateway stopped');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app; // Export pour les tests