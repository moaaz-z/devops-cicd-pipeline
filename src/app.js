const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────

// Home page
app.get('/', (req, res) => {
  res.render('index', {
    title: 'DevOps CI/CD Pipeline Demo',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Health check endpoint (used by Docker & Jenkins)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'devops-cicd-pipeline',
    version: process.env.APP_VERSION || '1.0.0',
    description: 'A simple web application demonstrating Docker & Jenkins CI/CD',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
  });
});

// ─── Start server ────────────────────────────────────────

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`📡 API info:     http://localhost:${PORT}/api/info`);
    console.log(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
