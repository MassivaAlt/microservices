// product-service/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');
const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = config.port;

//    Middlewares                                                    
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));
app.use(express.json());

//    Health check (utilisé par le Gateway)                         
app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'up', timestamp: new Date().toISOString() });
});

//    Routes                                                         
app.use('/api/products', productRoutes);

//    404                                                            
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

//    Error handler                                                  
app.use((err, req, res, next) => {
  logger.error(err.message, {
    route: req.originalUrl,
    method: req.method,
    status: err.status || 500,
    stack: err.stack,
  });
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

//    Start                                                          
const server = app.listen(PORT, () => {
  logger.info(`Product Service running on port ${PORT}`);
// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal} - closing product-service`);
  server.close(() => {
    console.log('Product Service stopped');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
