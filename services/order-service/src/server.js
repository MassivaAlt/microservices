// order-service/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');
const requestLogger = require('./middlewares/requestLogger');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));
app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'up', timestamp: new Date().toISOString() });
});

app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  logger.error(err.message, {
    route: req.originalUrl,
    method: req.method,
    status: err.status || 500,
    stack: err.stack,
  });
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

module.exports = app;
