const request = require('supertest');

const {
  setupApp,
  teardownApp,
  registerUser,
  loginAs,
  createUserAndLogin,
  expectSuccess,
  expectError
} = require('./helpers');

describe('Auth API', () => {
  let app;
  let db;
  let testDir;
  let api;

  beforeEach(() => {
    const environment = setupApp();
    app = environment.app;
    db = environment.db;
    testDir = environment.testDir;
    api = request(app);
  });

  afterEach(() => {
    teardownApp({ db, testDir });
  });

  test('registers a new user and returns a JWT token', async () => {
    const response = await registerUser(api, {
      name: 'Jay',
      email: 'jay@example.com',
      password: 'password123',
      role: 'manager'
    });

    expectSuccess(response);
    expect(response.status).toBe(201);
    expect(response.body.data.user).toMatchObject({
      name: 'Jay',
      email: 'jay@example.com',
      role: 'manager'
    });
    expect(response.body.data.user).not.toHaveProperty('password_hash');
    expect(response.body.data.token).toEqual(expect.any(String));
  });

  test('rejects invalid registration input', async () => {
    const response = await registerUser(api, {
      name: 'Jay',
      email: 'not-an-email',
      password: 'short'
    });

    expectError(response, 400, 'VALIDATION_ERROR');
    expect(response.body.message).toBe('Registration validation failed');
    expect(response.body.details).toContain('email must be valid');
    expect(response.body.details).toContain('password must be at least 6 characters');
  });

  test('rejects duplicate email addresses during registration', async () => {
    const firstResponse = await registerUser(api, {
      name: 'Jay',
      email: 'jay@example.com',
      password: 'password123'
    });

    expectSuccess(firstResponse);

    const duplicateResponse = await registerUser(api, {
      name: 'Jay Duplicate',
      email: 'jay@example.com',
      password: 'password456'
    });

    expectError(duplicateResponse, 409, 'UNIQUE_CONSTRAINT');
  });

  test('logs in with valid credentials and returns a JWT token', async () => {
    await registerUser(api, {
      name: 'Jay',
      email: 'jay@example.com',
      password: 'password123',
      role: 'user'
    });

    const response = await loginAs(api, {
      email: 'jay@example.com',
      password: 'password123'
    });

    expectSuccess(response);
    expect(response.status).toBe(200);
    expect(response.body.data.user).toMatchObject({
      name: 'Jay',
      email: 'jay@example.com',
      role: 'user'
    });
    expect(response.body.data.token).toEqual(expect.any(String));
  });

  test('rejects login attempts with invalid credentials', async () => {
    await registerUser(api, {
      name: 'Jay',
      email: 'jay@example.com',
      password: 'password123'
    });

    const response = await loginAs(api, {
      email: 'jay@example.com',
      password: 'wrong-password'
    });

    expectError(response, 401, 'AUTH_FAILED');
    expect(response.body.message).toBe('Invalid credentials');
  });

  test('protects task endpoints from unauthenticated requests', async () => {
    const response = await api.get('/api/tasks');

    expectError(response, 401, 'AUTH_REQUIRED');
    expect(response.body.message).toBe('Authentication required');
  });

  test('register and login flow can be used together in tests', async () => {
    const result = await createUserAndLogin(api, {
      name: 'Jay',
      email: 'jay@example.com',
      password: 'password123',
      role: 'admin'
    });

    expect(result.registration.status).toBe(201);
    expect(result.login.status).toBe(200);
    expect(result.user).toMatchObject({
      name: 'Jay',
      email: 'jay@example.com',
      role: 'admin'
    });
    expect(result.token).toEqual(expect.any(String));
  });
});
