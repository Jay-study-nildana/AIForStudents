# Taskly API

A REST API for the Taskly Task Management application.

## Tech Stack
- Node.js + Express.js
- SQLite (better-sqlite3)
- JWT (jsonwebtoken + bcryptjs)
- Swagger (swagger-jsdoc + swagger-ui-express)
- Jest + Supertest

## Prerequisites
- Node.js 18+
- npm

## Quick Start

```bash
# 1. Navigate to backend
cd taskly-api

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the server
npm run dev
```

The API will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DB_PATH` | `./taskly.db` | SQLite database file path |
| `JWT_SECRET` | *(required)* | Secret key for JWT token signing — change this in production! |

Edit `.env` and set your own `JWT_SECRET` for security.

## Running

```bash
# Development (with auto-restart via nodemon)
npm run dev

# Production
npm start
```

## API Documentation

Swagger UI is available at `http://localhost:3000/api-docs`.

Example API calls:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskly.local","password":"admin123"}'

# List tasks (use token from login response)
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## API Endpoints

### Authentication (Public)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user (returns JWT) |
| POST | `/api/auth/login` | Login and receive JWT token |

### Categories (Public CRUD)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:id` | Get a single category |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Tasks (Protected — JWT Required)
| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/api/tasks` | List tasks (role-filtered) | All |
| GET | `/api/tasks/:id` | Get a single task | All |
| POST | `/api/tasks` | Create a task | All |
| PUT | `/api/tasks/:id` | Update a task | All (role-based fields) |
| DELETE | `/api/tasks/:id` | Delete a task | All (role-based access) |
| GET | `/api/tasks?status=todo` | Filter by status | All |
| GET | `/api/tasks?category_id=X` | Filter by category | All |
| GET | `/api/tasks?search=keyword` | Search by title/description | All |

### Users (Admin Only)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users |
| DELETE | `/api/users/:id` | Delete a user (cannot delete self) |

## Role-Based Access Control

| Role | Task Permissions | User Management |
|------|------------------|-----------------|
| `user` | View/create/edit/delete own tasks only | No |
| `manager` | View all, full edit on own, status-only edit on others | No |
| `admin` | Full CRUD on everything + user management | Yes |

## Response Format

All responses follow a consistent JSON structure:

**Success:**
```json
{ "success": true, "data": { ... }, "message": "..." }
```

**Error:**
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

Common error codes: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `INTERNAL_ERROR` (500)

## Default Seed Data

On first run, the database is seeded with:

- **Admin user:** `admin@taskly.local` / `admin123`
- **Regular user:** `user@taskly.local` / `user123`
- **Categories:** Work, Personal, Shopping

To reset the database, delete `taskly.db` — it will be re-seeded on next startup.

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

## Project Structure

```
taskly-api/
├── src/
│   ├── config/
│   │   ├── database.js      # SQLite connection
│   │   ├── initDb.js        # Table creation
│   │   └── seed.js          # Seed data
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   ├── role.js          # Role-based access
│   │   └── errorHandler.js  # Global error handling
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   └── utils/
├── swagger/
│   └── swagger.js           # OpenAPI spec
├── tests/
│   ├── auth.test.js
│   ├── categories.test.js
│   ├── tasks.test.js
│   └── admin.test.js
├── .env.example
├── package.json
├── server.js
└── README.md
```
