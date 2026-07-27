# Taskly API

A full-stack task management REST API with JWT authentication and Role-Based Access Control (RBAC).

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Project Structure](#project-structure)

## Getting Started

Welcome to Taskly API! This is a comprehensive task management REST API that includes:

- Public category CRUD endpoints (no authentication required)
- JWT-based authentication and user registration
- Role-Based Access Control (RBAC) with 3 roles: `user`, `manager`, and `admin`
- Protected task endpoints with different permissions per role
- Interactive Swagger documentation
- Unit and integration tests with code coverage

## Installation

```bash
# Clone the repository
cd /path/to/your/project

# Install dependencies
npm install

# Copy environment variables from example
cp .env.example .env

# Edit .env file with your configuration
```

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./database.db

# JWT Authentication
JWT_SECRET=your_s...e
# Security
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:5173

# API Version
API_VERSION=v1
```

## Running the Application

```bash
# Start the development server (with auto-restart)
npm run dev

# Start the server (no auto-restart)
npm start

# Access the API at:
# - Health Check: http://localhost:3000/api/health
# - API Docs: http://localhost:3000/api-docs
# - Categories: http://localhost:3000/api/categories
# - Auth: http://localhost:3000/api/auth/login
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# View interactive coverage report
npm run coverage

# Test individual categories:
# - Public category endpoints (no auth required)
# - Authentication flows (register/login)
# - Role-based task access
```

## API Documentation

Check out the interactive Swagger documentation:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **API Health**: `GET /api/health`

All endpoints are documented with:
- Method and path
- Request body schemas
- Response schemas
- Authentication requirements
- Role-based permissions

## Features

### Public Category Endpoints
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Authentication System
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- Secure password hashing with bcrypt
- Protected routes with JWT validation

### Role-Based Access Control

**Roles:**
- **user**: View own tasks, create own tasks, update own tasks
- **manager**: All user permissions + view all tasks, update task status
- **admin**: All manager permissions + delete any task, manage users

**Task Permissions:**
- `user`: View own tasks, create tasks, update own tasks
- `manager`: All user permissions + view all tasks, update task status
- `admin`: All manager permissions + delete any task, manage users

### Protected Task Endpoints
- `GET /api/tasks` - List tasks (filtered by role)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Database Schema

**Tables:**
- **users**: User accounts with role-based access
- **categories**: Public category organization
- **tasks**: User tasks with status and category relationships

**Relationships:**
- Tasks belong to users (foreign key)
- Tasks can belong to categories (foreign key)
- Role validation ensures proper access control

## Project Structure

```
taskly-api/
├── server.js                     # Express application entry point
├── package.json                   # Project dependencies and scripts
├── .env.example                   # Environment variables template
├── .env                           # Environment variables (not committed)
├── README.md                      # This documentation
├── src/
│   ├── config/
│   │   └── database.js           # Database connection and initialization
│   ├── controllers/              # API route handlers
│   │   ├── authController.js      # Authentication logic
│   │   ├── categoryController.js  # Category management
│   │   └── taskController.js      # Task management with RBAC
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT authentication
│   │   └── role.js               # Role-based access control
│   ├── routes/                   # Express route definitions
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── categoryRoutes.js      # Category routes (public)
│   │   └── taskRoutes.js          # Task routes (protected)
│   ├── models/                   # Database models (if used)
│   ├── services/                 # Service layers (if used)
│   ├── swagger/                   # Swagger configuration
│   └── utils/                     # Utility functions (if used)
└── tests/                        # Test suite
    ├── auth.test.js              # Authentication tests
    ├── categories.test.js        # Category endpoint tests
    └── tasks.test.js             # Task RBAC tests
```

## Success Criteria

✅ Server starts cleanly with `npm run dev`
✅ Swagger UI loads with all endpoints documented
✅ Public category CRUD works without authentication
✅ Register/Login returns valid JWT tokens
✅ Task endpoints enforce correct role permissions
✅ All tests pass
✅ Coverage report generates successfully
✅ README contains clear run instructions

## Additional Notes

### Testing
All tests are written using Jest and Supertest. Tests are organized to cover:

1. **Public Category Endpoints** - No authentication required
2. **Authentication Flows** - User registration and login
3. **Role-Based Access Control** - Different permissions for each role

### Security
- Passwords are securely hashed using bcrypt
- JWT tokens are signed with environment variable secrets
- CORS is configured for security
- Helmet middleware provides basic security headers

### Database
- SQLite database with proper foreign key constraints
- Indexes for performance optimization
- Automatic initialization on startup

**This specification is designed to be comprehensive yet achievable in one focused build session with a strong agentic model.**