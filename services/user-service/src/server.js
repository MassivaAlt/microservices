require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// health check
app.get('/health', (req, res) => {
  res.json({
    service: 'user-service',
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// routes
app.use('/api/users', userRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(`[user-service ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// start
const server = app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal} - closing user-service`);
  server.close(() => {
    console.log('User Service stopped');
    process.exit(0);
  });

  // Force exit after timeout
  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;