const fs = require('fs');
const os = require('os');
const path = require('path');
const jwt = require('jsonwebtoken');

jest.setTimeout(10000);

function clearAppModules() {
  jest.resetModules();
}

function setupApp() {
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskly-api-'));
  const dbPath = path.join(testDir, 'taskly.sqlite');

  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.DB_PATH = dbPath;
  delete process.env.CORS_ORIGIN;

  clearAppModules();

  const app = require('../src/app');
  const db = require('../src/config/database');

  return { app, db, dbPath, testDir };
}

function teardownApp({ db, testDir }) {
  if (db && typeof db.close === 'function') {
    db.close();
  }

  if (testDir && fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  clearAppModules();

  delete process.env.DB_PATH;
  delete process.env.JWT_SECRET;
  delete process.env.JWT_EXPIRES_IN;
  delete process.env.NODE_ENV;
  delete process.env.CORS_ORIGIN;
}

function seedUser(db, overrides = {}) {
  const name = overrides.name || 'Test User';
  const email = overrides.email || `user-${Date.now()}-${Math.random()}@example.com`;
  const password = overrides.password || 'password123';
  const role = overrides.role || 'user';

  const result = db
    .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name, email, password, role);

  return db
    .prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
    .get(result.lastInsertRowid);
}

function seedCategory(db, name = 'Development') {
  const result = db
    .prepare('INSERT INTO categories (name) VALUES (?)')
    .run(name);

  return db
    .prepare('SELECT id, name, created_at FROM categories WHERE id = ?')
    .get(result.lastInsertRowid);
}

function seedTask(db, overrides = {}) {
  const user = overrides.user || seedUser(db);
  const title = overrides.title || 'Test task';
  const description = overrides.description || 'Task description';
  const status = overrides.status || 'todo';
  const categoryId = overrides.category_id || null;

  const result = db
    .prepare('INSERT INTO tasks (title, description, status, user_id, category_id) VALUES (?, ?, ?, ?, ?)')
    .run(title, description, status, user.id, categoryId);

  return db
    .prepare('SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks WHERE id = ?')
    .get(result.lastInsertRowid);
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

async function registerUser(request, userData) {
  const response = await request
    .post('/api/auth/register')
    .send(userData);

  return response;
}

async function loginAs(request, userData) {
  const response = await request
    .post('/api/auth/login')
    .send(userData);

  return response;
}

async function createUserAndLogin(request, userData) {
  const registration = await registerUser(request, userData);

  if (registration.status !== 201) {
    return registration;
  }

  const login = await loginAs(request, {
    email: registration.body.data.user.email,
    password: registration.body.data.user.password || userData.password
  });

  return {
    registration,
    login,
    user: login.body.data.user,
    token: login.body.data.token
  };
}

function expectSuccess(response) {
  expect(response.body.success).toBe(true);
}

function expectError(response, statusCode, code) {
  expect(response.status).toBe(statusCode);
  expect(response.body.success).toBe(false);

  if (code) {
    expect(response.body.code).toBe(code);
  }
}

module.exports = {
  setupApp,
  teardownApp,
  seedUser,
  seedCategory,
  seedTask,
  createToken,
  authHeader,
  registerUser,
  loginAs,
  createUserAndLogin,
  expectSuccess,
  expectError
};
