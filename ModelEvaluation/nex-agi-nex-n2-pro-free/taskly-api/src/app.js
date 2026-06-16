const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

require('./config/database');

const swaggerSpec = require('../swagger/swagger');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./utils/errorHandler');
const notFoundHandler = require('./utils/notFoundHandler');

const app = express();

app.use(helmet());

if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
} else {
  app.use(cors());
}

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Taskly API is running',
    data: {
      status: 'ok'
    }
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
