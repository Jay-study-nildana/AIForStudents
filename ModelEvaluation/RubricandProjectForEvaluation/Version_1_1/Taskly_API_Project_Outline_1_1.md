# Taskly API - Project Outline & Specification - 1.1

> **Purpose**: This document is a complete, ready-to-use specification you can feed directly to an AI coding agent (such as **Hermes Agent**).  
> It defines a full Node.js + Express backend project with public + authenticated CRUD, role-based access control, Swagger docs, tests, and coverage.

---

## Project Goal

Build a clean, well-structured, and production-style **REST API** for a simple Task Management application called **Taskly**.

The project must demonstrate:
- Public endpoints (no auth)
- JWT-based authentication + registration
- Role-Based Access Control (RBAC)
- Protected endpoints with different permissions per role
- Professional documentation (Swagger)
- Automated testing + code coverage
- Clear instructions for running everything

---

## Tech Stack (Mandatory)

| Category          | Technology                          | Purpose                          |
|-------------------|-------------------------------------|----------------------------------|
| Runtime           | Node.js                             | -                                |
| Framework         | Express.js                          | Web server & routing             |
| Database          | SQLite (`better-sqlite3`)           | Lightweight file-based DB        |
| Authentication    | JWT (`jsonwebtoken` + `bcryptjs`)   | Secure login & tokens            |
| Documentation     | Swagger (`swagger-jsdoc` + `swagger-ui-express`) | Interactive API docs     |
| Testing           | Jest + Supertest                    | Unit & integration tests         |
| Coverage          | Jest `--coverage`                   | Code coverage reports            |
| Utilities         | `dotenv`, `cors`, `helmet`          | Config, CORS, basic security     |
| Dev Tool          | `nodemon`                           | Auto-restart during development  |

---

## Core Features

### 1. Public CRUD Endpoints (No Authentication)
- **Resource**: `Categories`
- Full CRUD operations:
  - Create, Read (list + single), Update, Delete

### 2. Authentication System
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and return JWT token
- Passwords must be securely hashed using bcrypt
- All protected routes must validate JWT

### 3. Role-Based Access Control (RBAC)
**Roles**:
- `user`
- `manager`
- `admin`

**Role Permissions (Tasks)**:
| Role      | View Own Tasks | View All Tasks | Create Tasks | Update Own Tasks | Update Any Task | Delete Own Tasks | Delete Any Task | Manage Users |
|-----------|----------------|----------------|--------------|------------------|-----------------|------------------|-----------------|--------------|
| `user`    | Yes            | No             | Yes          | Yes              | No              | Yes              | No              | No           |
| `manager` | Yes            | Yes            | Yes          | Yes              | Yes (status)    | Yes              | No              | No           |
| `admin`   | Yes            | Yes            | Yes          | Yes              | Yes             | Yes              | Yes             | Yes          |

### 4. Protected CRUD Endpoints (Tasks)
Main resource: **Tasks** (each task belongs to a user via `user_id`)

**Required Endpoints**:
- `GET /api/tasks` — List tasks (results filtered by role)
- `POST /api/tasks` — Create task
- `GET /api/tasks/:id` — Get single task
- `PUT /api/tasks/:id` — Update task
- `DELETE /api/tasks/:id` — Delete task

**Optional but Recommended** (Admin only):
- `GET /api/users`
- `DELETE /api/users/:id`

### 5. Swagger Documentation
- Interactive docs available at `/api-docs`
- Every endpoint must be documented with:
  - Method, path, description
  - Request body schema
  - Response schemas
  - Authentication & role requirements

### 6. Testing Requirements
- Use **Jest** + **Supertest**
- Test categories:
  - Public category endpoints
  - Authentication flows
  - Role-based task access (using tokens from different roles)
- Tests should be organized and readable

### 7. Code Coverage
- Generate coverage report using `npm test -- --coverage`
- Include coverage badge or report summary in README

### 8. README.md (This Document)
Must include clear instructions for:
- Cloning and installing dependencies
- Setting up environment variables
- Initializing the database
- Running the development server
- Running tests + viewing coverage
- Accessing Swagger UI
- Example usage with different roles

---

## Database Schema (SQLite)

### `users` table
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
role TEXT DEFAULT 'user' CHECK(role IN ('user', 'manager', 'admin'))
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### `categories` table
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL UNIQUE
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### `tasks` table
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
title TEXT NOT NULL
description TEXT
status TEXT DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done'))
user_id INTEGER NOT NULL
category_id INTEGER
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY(user_id) REFERENCES users(id)
FOREIGN KEY(category_id) REFERENCES categories(id)
```

---

## Recommended Project Structure

```
taskly-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── role.js
│   ├── models/
│   │   └── (or keep queries in controllers/services)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── taskRoutes.js
│   ├── services/
│   └── utils/
├── tests/
│   ├── auth.test.js
│   ├── categories.test.js
│   └── tasks.test.js
├── swagger/
│   └── swagger.js          # or config inline
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

## Additional Quality Requirements

- Consistent JSON response format (success/error)
- Proper HTTP status codes
- Input validation (simple checks or `express-validator`)
- Error handling middleware
- Use of environment variables (`PORT`, `JWT_SECRET`, `DB_PATH`)
- Clean, readable, and well-commented code where helpful
- The final project must start with a single command after setup

---

## How to Use This Document with Hermes Agent

1. Copy the entire content of this file.
2. Paste it into Hermes with a prompt like:

> "Build the complete Taskly API project exactly as described in the specification below. Create all folders and files. Make everything fully functional and runnable."

3. You can also ask Hermes to build it in stages if needed (e.g., first skeleton + DB, then auth, then tests, etc.).

---

## Success Criteria

- [ ] Server starts cleanly with `npm run dev`
- [ ] Swagger UI loads at `/api-docs` with all endpoints documented
- [ ] Public category CRUD works without token
- [ ] Register/Login returns valid JWT
- [ ] Task endpoints enforce correct role permissions
- [ ] All tests pass
- [ ] Coverage report generates successfully
- [ ] README contains clear run instructions

---

**This specification is designed to be comprehensive yet achievable in one focused build session with a strong agentic model.**