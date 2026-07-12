# package.json — Line-by-Line Explanation

> This document explains every field and dependency in `package.json`.
> Since JSON does not support comments, this file serves as the authoritative reference.

---

## Project Metadata

### `"name": "taskly-api"`
The npm package name. Used when publishing to npm (not needed for local-only, but required by npm). Must be lowercase, no spaces. Matches the folder name.

### `"version": "1.1.0"`
Semantic versioning (MAJOR.MINOR.PATCH). Matches the Taskly project version (v1.1). Increment MINOR for new features, PATCH for bug fixes, MAJOR for breaking changes.

### `"description": "Taskly REST API — Task Management Application"`
Human-readable project description. Shows up on npm (if published) and in IDE tooltips.

### `"main": "server.js"`
Entry point for the application. When another module does `require('taskly-api')`, Node loads this file. Also used by `npm start` implicitly. Our `server.js` exports the Express app for testing and starts the server when run directly.

### `"keywords": []`
Search keywords for npm publishing. Empty since this is a local-only project. Could add: `["taskly", "rest-api", "express", "sqlite"]`.

### `"author": ""`
Project author. Left empty intentionally. Could be filled with name/email.

### `"license": "ISC"`
Open-source license. ISC is a permissive license similar to MIT, commonly used for Node.js projects. Required by npm.

---

## Scripts

Scripts are run with `npm run <name>` (or just `npm start` / `npm test` for those two special cases).

### `"start": "node server.js"`
**Command:** `npm start`
Starts the production server. Runs `node server.js` directly without any file-watching. Used when you want to run the API without auto-restart on code changes.

### `"dev": "nodemon server.js"`
**Command:** `npm run dev`
Starts the development server using **nodemon**, which watches all files and auto-restarts the server whenever a file changes. This is the command you'll use during active development.

### `"test": "jest --forceExit --detectOpenHandles"`
**Command:** `npm test`
Runs all tests using **Jest**. Flags:
- `--forceExit` — Forces Jest to exit after all tests complete. Needed because our database connection and server keep the event loop alive.
- `--detectOpenHandles` — Warns about asynchronous operations that prevent Jest from shutting down cleanly. Helps catch resource leaks in tests.

### `"test:coverage": "jest --forceExit --detectOpenHandles --coverage"`
**Command:** `npm run test:coverage`
Same as `npm test` but also generates a **code coverage report**. Shows which lines, branches, and functions are covered by tests. Output goes to `coverage/` directory.

---

## Production Dependencies

These packages are required for the application to run in any environment.

### `"express": "^5.2.1"`
**Web framework.** Handles HTTP requests, routing, middleware, and responses. Express is the most popular Node.js web framework. Version 5.x is the latest major version. The `^` means "compatible with 5.2.1 but below 6.0.0".

### `"better-sqlite3": "^12.11.1"`
**Database driver.** Synchronous SQLite3 driver for Node.js. "Better" because it's faster and supports prepared statements natively. Synchronous API means no callbacks or promises needed for DB queries — simpler code. Stores data in a single `.env`-configurable file.

### `"jsonwebtoken": "^9.0.3"`
**JWT library.** Creates and verifies JSON Web Tokens for authentication. Used for:
- Generating tokens on login/register (signed with JWT_SECRET)
- Verifying tokens in the auth middleware on protected routes
- Token payload: `{ id, email, role }` (all GUIDs)

### `"bcryptjs": "^3.0.3"`
**Password hashing.** Securely hashes passwords before storing them in the database. "js" variant is pure JavaScript (no native compilation needed). Used in the registration flow to hash passwords and in the login flow to compare submitted passwords against stored hashes.

### `"dotenv": "^17.4.2"`
**Environment variable loader.** Reads key-value pairs from a `.env` file and sets them as `process.env` variables. Keeps secrets (JWT_SECRET, DB_PATH) out of source code. The app calls `require('dotenv').config()` at the top of `server.js`.

### `"cors": "^2.8.6"`
**Cross-Origin Resource Sharing.** Middleware that allows the frontend (running on `http://localhost:5173`) to make requests to the backend (running on `http://localhost:3000`). Without this, browsers would block frontend API calls due to same-origin policy.

### `"helmet": "^8.2.0"`
**Security middleware.** Sets various HTTP headers to protect against common web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.). A collection of 14 smaller security middleware functions. Zero configuration needed — just `app.use(helmet())`.

### `"swagger-jsdoc": "^6.3.0"`
**Swagger spec generator.** Reads JSDoc comments in route files and automatically generates an OpenAPI (Swagger) specification. This spec is then served by swagger-ui-express.

### `"swagger-ui-express": "^5.0.1"`
**Swagger UI server.** Serves the Swagger interactive API documentation at `/api-docs`. Takes the spec generated by swagger-jsdoc and renders a beautiful, interactive UI where you can test all endpoints directly from the browser.

---

## Dev Dependencies

These packages are only needed during development and testing. Not installed in production (`npm install --production` skips them).

### `"jest": "^30.4.2"`
**Testing framework.** Runs unit and integration tests. Provides `describe()`, `it()`, `expect()`, mocking, and coverage. Jest 30 is the latest major version. Configured via `package.json` scripts (no separate config file needed for basic setup).

### `"supertest": "^7.2.2"`
**HTTP testing library.** Allows making HTTP requests to the Express app without actually starting a server. Used in integration tests to test endpoints end-to-end. Works by passing the Express app directly to `request(app).get('/api/tasks')` etc.

### `"nodemon": "^3.1.14"`
**Development auto-restarter.** Watches all files in the project and restarts the Node.js process whenever a file changes. Eliminates the need to manually stop and restart the server during development. Configured via the `dev` script.

---

## Version Caret (^) Explanation

All dependencies use the `^` (caret) prefix. This means:
- `^5.2.1` → accepts `5.2.1` and anything below `6.0.0` (e.g., `5.3.0`, `5.9.9`)
- `^3.0.3` → accepts `3.0.3` and anything below `4.0.0`

This allows minor updates and patch fixes automatically when running `npm update`, but prevents breaking changes from major version upgrades.

To lock versions exactly (no auto-updates), remove the `^` prefix. To see what updates are available, run `npm outdated`.
