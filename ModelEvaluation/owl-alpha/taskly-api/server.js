require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const { initializeDatabase } = require('./src/config/initDb');
const { seedDatabase } = require('./src/config/seed');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Taskly API is running' });
});

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs-json', (req, res) => {
  res.json(swaggerSpec);
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/tasks', require('./src/routes/taskRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// 404 handler for undefined routes
app.use(require('./src/middleware/errorHandler').notFoundHandler);

// Global error handling middleware (must be last)
app.use(require('./src/middleware/errorHandler').errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  // Initialize database tables and seed data
  initializeDatabase();
  seedDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Taskly API running on port ${PORT}`);
    });
  });
}

module.exports = app;
