require('dotenv').config();

const serviceName = process.env.SERVICE_NAME || 'user-service';
const port = Number(process.env.PORT) || 3001;
const env = process.env.NODE_ENV || 'development';
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;
const logLevel = process.env.LOG_LEVEL || 'info';

module.exports = {
  serviceName,
  port,
  env,
  corsOrigin,
  logLevel,
};
