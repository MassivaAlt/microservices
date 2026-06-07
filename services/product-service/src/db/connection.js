const { Pool } = require('pg');
const dbConfig = require('../config/db');
const logger = require('../logger');

const pool = new Pool({
  connectionString: dbConfig.databaseUrl,
  max: dbConfig.max,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
});

pool.on('error', (error) => {
  logger.error('Unexpected PostgreSQL client error', {
    service: 'product-service',
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

const query = async (text, params) => {
  if (dbConfig.env !== 'production') {
    logger.debug('SQL query', { service: 'product-service', sql: text, params });
  }
  return pool.query(text, params);
};

module.exports = {
  pool,
  query,
};
