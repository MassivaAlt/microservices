const config = require('../config/db');
const logger = require('../logger');

const connectDb = async () => {
  if (!config.databaseUrl) {
    logger.info('No DATABASE_URL configured, skipping DB initialization', {
      service: 'product-service',
    });
    return;
  }

  logger.info('Database configuration detected, ready for DB connection', {
    provider: config.provider,
    databaseName: config.databaseName,
    service: 'product-service',
  });

  // TODO: add a real database driver and connection code here
};

module.exports = { connectDb };
