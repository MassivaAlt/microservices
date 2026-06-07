const config = require('./config');

const log = (level, message, meta = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    service: config.serviceName,
    level,
    message,
    ...meta,
  };

  const output = JSON.stringify(payload);
  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
};

module.exports = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  debug: (message, meta = {}) => {
    if (config.env !== 'production') {
      log('debug', message, meta);
    }
  },
};
