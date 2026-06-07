// order-service/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const orderRoutes = require('./routes/order.routes');

const app = express();
const PORT = process.env.PORT || 3003;

//    Middlewares                                                    
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//    Health check (utilisé par le Gateway)                         
app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'up', timestamp: new Date().toISOString() });
});

//    Routes                                                         
app.use('/api/orders', orderRoutes);

//    404                                                            
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

//    Error handler                                                  
app.use((err, req, res, next) => {
  console.error(`[order-service ERROR] ${err.message}`);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

//    Start                                                          
const server = app.listen(PORT, () => {
  console.log(`📦 Order Service running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal} - closing order-service`);
  server.close(() => {
    console.log('Order Service stopped');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
