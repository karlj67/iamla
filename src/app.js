const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const prescriberRoutes = require('./routes/prescribers');
const visitRoutes = require('./routes/visits');
const locationRoutes = require('./routes/locations');
const statsRoutes = require('./routes/stats');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const prescriberTypeRoutes = require('./routes/prescriberTypes');

const app = express();

// Middleware CORS
app.use(cors({
  origin: ['https://iamla.alwaysdata.net', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route racine de l'API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API IAMLA en ligne',
    version: '1.0.0',
    endpoints: [
      '/api/auth/login (POST)',
      '/api/auth/logout (POST)',
      '/api/prescribers (GET, POST)',
      '/api/visits (GET, POST)',
      '/api/locations (GET, POST)',
      '/api/stats (GET)',
      '/api/users (GET, POST)',
      '/api/teams (GET, POST)'
    ]
  });
});

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/prescribers', prescriberRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/prescriber-types', prescriberTypeRoutes);
app.use('/api/stats/admin', statsRoutes);

// Gestion des erreurs 404 pour l'API
app.use('/api/*', (req, res) => {
  console.log(`Route API non trouvée: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'API Route non trouvée',
    method: req.method,
    path: req.path,
    availableEndpoints: [
      '/api/auth/login (POST)',
      '/api/auth/logout (POST)',
      '/api/prescribers (GET, POST)',
      '/api/visits (GET, POST)',
      '/api/locations (GET, POST)',
      '/api/stats (GET)',
      '/api/users (GET, POST)',
      '/api/teams (GET, POST)'
    ]
  });
});

// Route pour servir l'application React
app.use(express.static(path.join(__dirname, '../client/dist')));

// Toutes les autres routes renvoient vers l'app React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  console.error('Detailed error:', {
    message: err.message,
    code: err.code,
    path: req.path,
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body
  });
  res.status(500).json({ 
    message: 'Une erreur est survenue!', 
    error: err.message,
    path: req.path,
    method: req.method
  });
});

module.exports = app; 