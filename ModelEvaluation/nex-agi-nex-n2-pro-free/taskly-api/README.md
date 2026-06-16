# Taskly API

Taskly API is a Node.js + Express REST API for a simple task management application. It uses SQLite for persistence, JWT-based authentication, and role-based access control.

## Tech stack

- Node.js
- Express
- SQLite with `better-sqlite3`
- JWT authentication with `jsonwebtoken`
- Password hashing with `bcryptjs`
- Swagger/OpenAPI documentation with `swagger-jsdoc` and `swagger-ui-express`
- Jest + Supertest for API tests

## Project structure

```text
taskly-api/
  data/
    taskly.sqlite              # Local SQLite database created at runtime
  src/
    app.js                     # Express app wiring
    config/
      database.js              # SQLite connection and schema initialization
    controllers/
      authController.js
      categoryController.js
      taskController.js
    middleware/
      auth.js                  # JWT authentication middleware
      role.js                  # RBAC helpers
    routes/
      authRoutes.js
      categoryRoutes.js
      taskRoutes.js
    utils/
      errorHandler.js
      notFoundHandler.js
      responses.js
      validators.js
  swagger/
    swagger.js                 # OpenAPI/Swagger specification
  tests/
    auth.test.js
    categories.test.js
    helpers.js
    tasks.test.js
  .env.example
  package.json
  README.md
  server.js
```

## Setup

From the project root:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your own values. Do not commit real secrets.

## Environment variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | Server port. Defaults to `3000`. |
| `NODE_ENV` | No | `development` | Runtime mode. In `production`, `JWT_SECRET` is required. |
| `JWT_SECRET` | Yes in production | `<your-jwt-secret>` | Secret used to sign JWTs. Use a strong random value. |
| `JWT_EXPIRES_IN` | No | `1h` | JWT expiration value accepted by `jsonwebtoken`. |
| `DB_PATH` | No | `data/taskly.sqlite` | SQLite database path. Defaults to `data/taskly.sqlite`. |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Optional single allowed CORS origin. If omitted, CORS is open. |

Example `.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=<change-me-in-production>
JWT_EXPIRES_IN=1h
DB_PATH=data/taskly.sqlite
CORS_ORIGIN=http://localhost:5173
```

## Scripts

```bash
npm run dev
```

Starts the API with `nodemon`.

```bash
npm test
```

Runs the Jest + Supertest suite.

```bash
npm run coverage
```

Runs tests with Jest coverage.

## Start the API

```bash
npm run dev
```

Default API URL:

```text
http://localhost:3000
```

## Swagger documentation

Open Swagger UI at:

```text
http://localhost:3000/api-docs
```

The Swagger document includes:

- Health check
- Auth register/login
- Public category CRUD
- Protected task CRUD
- Request schemas
- Response schemas
- JWT bearer authentication
- Role notes for task operations

## Database behavior

The database is initialized automatically when the app starts.

Default database path:

```text
taskly-api/data/taskly.sqlite
```

Tables created automatically:

- `users`
- `categories`
- `tasks`

Foreign keys are enabled.

## API overview

Base path:

```text
/api
```

### Health

```http
GET /api/health
```

No authentication required.

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

No authentication required.

Register payload:

```json
{
  "name": "Jay",
  "email": "jay@example.com",
  "password": "password123",
  "role": "user"
}
```

Login payload:

```json
{
  "email": "jay@example.com",
  "password": "password123"
}
```

Successful auth responses include:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Jay",
      "email": "jay@example.com",
      "role": "user"
    },
    "token": "<jwt-token>"
  }
}
```

Use the returned token for protected task endpoints:

```http
Authorization: Bearer <jwt-token>
```

### Categories

Categories are public.

```http
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Create category payload:

```json
{
  "name": "Development"
}
```

Update category payload:

```json
{
  "name": "Backend"
}
```

### Tasks

All task endpoints require JWT authentication.

```http
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Create task payload:

```json
{
  "title": "Build API routes",
  "description": "Implement protected task endpoints",
  "status": "todo",
  "category_id": 1
}
```

`category_id` is optional. If provided, the category must exist.

Update task payload. Any combination is allowed:

```json
{
  "title": "Build API routes",
  "description": "Updated description",
  "status": "in_progress",
  "category_id": 2
}
```

## Authentication and RBAC model

Taskly API uses three roles:

| Role | Task permissions |
| --- | --- |
| `user` | Create tasks. View, update, and delete only their own tasks. |
| `manager` | View all tasks. Create tasks. Update another user's task status only. Update/delete own tasks. |
| `admin` | Full task management, including update/delete on any task. |

Notes:

- Users cannot view or modify another user's tasks.
- Managers can view all tasks but cannot change another user's title, description, or category.
- Admins can manage all tasks.
- Auth uses JWT only. No OAuth is used.

## Response format

Successful responses use this shape:

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {}
}
```

Error responses use this shape:

```json
{
  "success": false,
  "message": "Invalid credentials",
  "code": "AUTH_FAILED"
}
```

Validation errors include a `details` field:

```json
{
  "success": false,
  "message": "Task validation failed",
  "code": "VALIDATION_ERROR",
  "details": ["title is required"]
}
```

## Testing

The test suite uses isolated temporary SQLite databases, so tests do not modify the project database.

Run:

```bash
npm test
```

Expected result after implementation:

```text
Test Suites: 3 passed, 3 total
Tests:       17 passed, 17 total
```

## Security notes

- Use a strong random `JWT_SECRET` in production.
- Do not commit `.env`.
- Do not commit real passwords, tokens, API keys, or database credentials.
- `CORS_ORIGIN` should be set to a trusted frontend origin in production.
- The default development JWT secret in code is only for local convenience and should be replaced before production use.

## License

MIT
