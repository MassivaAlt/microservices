require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || '';
const provider = process.env.DB_PROVIDER || 'pg';
const databaseName = process.env.POSTGRES_DB || 'microservices';
const env = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || 'info';

module.exports = {
  databaseUrl,
  provider,
  databaseName,
  env,
  logLevel,
  max: Number(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
  connectionTimeoutMillis: Number(process.env.DB_CONN_TIMEOUT_MS) || 5000,
};
