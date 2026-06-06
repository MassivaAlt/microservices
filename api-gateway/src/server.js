// api-gateway/src/server.js
// Point d'entrée de l'API Gateway

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config');
const proxyRoutes = require('./routes/proxy');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Middlewares globaux ───────────────────────────────────────────
app.use(cors());                        // Autorise les requêtes cross-origin
app.use(morgan('dev'));                 // Logs HTTP dans le terminal
app.use(express.json());               // Parse le body JSON des requêtes

// ── Routes ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Gateway is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

app.use('/health', healthRoutes);      // Vérification de santé
app.use('/api', proxyRoutes);          // Proxy vers les microservices

// ── Route 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Gestion des erreurs globales ──────────────────────────────────
app.use(errorHandler);

// ── Démarrage du serveur ──────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 API Gateway running on http://localhost:${config.port}`);
  console.log(`📡 Proxying to:`);
  console.log(`   Users    → ${config.services.user}`);
  console.log(`   Products → ${config.services.product}`);
  console.log(`   Orders   → ${config.services.order}\n`);
});

module.exports = app; // Export pour les tests