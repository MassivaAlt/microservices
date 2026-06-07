const dbConfig = require('../config/db');
const logger = require('../logger');
const { query, pool } = require('./connection');

const connectDb = async () => {
  if (!dbConfig.databaseUrl) {
    logger.info('No DATABASE_URL configured, skipping DB initialization', {
      service: 'order-service',
    });
    return;
  }

  logger.info('Database configuration detected, attempting PostgreSQL connection', {
    provider: dbConfig.provider,
    databaseName: dbConfig.databaseName,
    service: 'order-service',
  });

  try {
    await query('SELECT 1');
    logger.info('Database connected successfully', {
      service: 'order-service',
      provider: dbConfig.provider,
      databaseName: dbConfig.databaseName,
    });
  } catch (error) {
    logger.error('Database connection failed', {
      service: 'order-service',
      error: error.message,
      stack: error.stack,
    });
    await pool.end();
    throw error;
  }
};

module.exports = { connectDb, query, pool };
