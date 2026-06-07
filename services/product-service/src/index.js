const app = require('./server');
const config = require('./config');
const logger = require('./logger');
const { connectDb } = require('./db');

const PORT = config.port;
let server;

const start = async () => {
  await connectDb();

  server = app.listen(PORT, () => {
    logger.info(`Product Service running on port ${PORT}`);
  });
};

const shutdown = (signal) => {
  logger.info(`Received ${signal} - closing product-service`);
  if (server) {
    server.close(() => {
      logger.info('Product Service stopped');
      process.exit(0);
    });
  }

  setTimeout(() => {
    logger.error('Forcing shutdown');
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
