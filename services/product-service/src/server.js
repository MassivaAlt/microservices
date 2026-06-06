// product-service/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 3002;

// ── Middlewares ───────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Health check (utilisé par le Gateway) ────────────────────────
app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'up', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Error handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[product-service ERROR] ${err.message}`);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`📦 Product Service running on http://localhost:${PORT}`);
});

module.exports = app;
