require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const historyRoutes = require('./routes/history');
const analyticsRoutes = require('./routes/analytics');
const runRoutes = require('./routes/run');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (Mongo or local persistent storage)
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-key', 'x-openai-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'TestPilot Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/run-tests', runRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const server = app.listen(PORT, () => {
  console.log(`✈️ TestPilot server running on http://localhost:${PORT}`);
});

module.exports = { app, server };
