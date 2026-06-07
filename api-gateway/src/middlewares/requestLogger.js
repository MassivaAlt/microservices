const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const logger = require('../logger');

const requestLogger = (req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || req.correlationId || uuidv4();
  res.setHeader('X-Correlation-ID', req.correlationId);

  const start = process.hrtime();
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

    logger.info('HTTP request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      correlationId: req.correlationId,
      service: config.serviceName,
    });
  });

  next();
};

module.exports = requestLogger;
