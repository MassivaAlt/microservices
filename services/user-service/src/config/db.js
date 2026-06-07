require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL || '',
  provider: process.env.DB_PROVIDER || 'pg',
  databaseName: process.env.POSTGRES_DB || 'microservices',
};
