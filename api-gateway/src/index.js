const app = require('./server');
const config = require('./config');
const logger = require('./logger');

const PORT = config.port;
let server;

const start = async () => {
  server = app.listen(PORT, () => {
    logger.info(`API Gateway running on http://localhost:${PORT}`, { service: config.serviceName });
    logger.info('Proxy targets loaded', {
      user: config.services.user,
      product: config.services.product,
      order: config.services.order,
    });
  });
};

const shutdown = (signal) => {
  logger.info(`Received ${signal} - closing api-gateway`, { service: config.serviceName });
  if (server) {
    server.close(() => {
      logger.info('API Gateway stopped', { service: config.serviceName });
      process.exit(0);
    });
  }

  setTimeout(() => {
    logger.error('Forcing shutdown', { service: config.serviceName });
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
