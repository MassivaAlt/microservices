require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = 3001;

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
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

module.exports = app;