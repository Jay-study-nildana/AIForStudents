const request = require('supertest');

const {
  setupApp,
  teardownApp,
  createUserAndLogin,
  seedCategory,
  seedTask,
  authHeader,
  expectSuccess,
  expectError
} = require('./helpers');

describe('Task API', () => {
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

  test('requires JWT authentication before listing tasks', async () => {
    const response = await api.get('/api/tasks');

    expectError(response, 401, 'AUTH_REQUIRED');
    expect(response.body.message).toBe('Authentication required');
  });

  test('allows a user to create, list, retrieve, update, and delete their own task', async () => {
    const user = await createUserAndLogin(api, {
      name: 'Jay',
      email: 'jay@example.com',
      password: 'password123',
      role: 'user'
    });

    const createResponse = await api
      .post('/api/tasks')
      .set(authHeader(user.token))
      .send({
        title: 'Learn Express',
        description: 'Build the API routes',
        status: 'todo'
      });

    expectSuccess(createResponse);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toMatchObject({
      title: 'Learn Express',
      description: 'Build the API routes',
      status: 'todo',
      user_id: user.user.id
    });

    const taskId = createResponse.body.data.id;

    const listResponse = await api
      .get('/api/tasks')
      .set(authHeader(user.token));

    expectSuccess(listResponse);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.data[0].id).toBe(taskId);

    const getResponse = await api
      .get(`/api/tasks/${taskId}`)
      .set(authHeader(user.token));

    expectSuccess(getResponse);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data).toMatchObject({
      id: taskId,
      title: 'Learn Express'
    });

    const updateResponse = await api
      .put(`/api/tasks/${taskId}`)
      .set(authHeader(user.token))
      .send({
        title: 'Learn Supertest',
        status: 'in_progress'
      });

    expectSuccess(updateResponse);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data).toMatchObject({
      id: taskId,
      title: 'Learn Supertest',
      status: 'in_progress'
    });

    const deleteResponse = await api
      .delete(`/api/tasks/${taskId}`)
      .set(authHeader(user.token));

    expectSuccess(deleteResponse);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data).toEqual({ id: taskId });

    const missingResponse = await api
      .get(`/api/tasks/${taskId}`)
      .set(authHeader(user.token));

    expectError(missingResponse, 404, 'NOT_FOUND');
  });

  test('prevents a user from viewing or updating another user task', async () => {
    const owner = await createUserAndLogin(api, {
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123',
      role: 'user'
    });

    const viewer = await createUserAndLogin(api, {
      name: 'Viewer',
      email: 'viewer@example.com',
      password: 'password123',
      role: 'user'
    });

    const task = seedTask(db, {
      title: 'Owner task',
      user: owner.user
    });

    const getResponse = await api
      .get(`/api/tasks/${task.id}`)
      .set(authHeader(viewer.token));

    expectError(getResponse, 403, 'FORBIDDEN');

    const updateResponse = await api
      .put(`/api/tasks/${task.id}`)
      .set(authHeader(viewer.token))
      .send({ title: 'Hacked title' });

    expectError(updateResponse, 403, 'FORBIDDEN');
  });

  test('allows managers to view all tasks and update another user status only', async () => {
    const owner = await createUserAndLogin(api, {
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123',
      role: 'user'
    });

    const other = await createUserAndLogin(api, {
      name: 'Other',
      email: 'other@example.com',
      password: 'password123',
      role: 'user'
    });

    const manager = await createUserAndLogin(api, {
      name: 'Manager',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager'
    });

    const ownerTask = seedTask(db, {
      title: 'Owner task',
      user: owner.user
    });

    const otherTask = seedTask(db, {
      title: 'Other task',
      user: other.user
    });

    const listResponse = await api
      .get('/api/tasks')
      .set(authHeader(manager.token));

    expectSuccess(listResponse);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.map((task) => task.id)).toEqual(expect.arrayContaining([
      ownerTask.id,
      otherTask.id
    ]));

    const statusUpdateResponse = await api
      .put(`/api/tasks/${otherTask.id}`)
      .set(authHeader(manager.token))
      .send({ status: 'done' });

    expectSuccess(statusUpdateResponse);
    expect(statusUpdateResponse.status).toBe(200);
    expect(statusUpdateResponse.body.data).toMatchObject({
      id: otherTask.id,
      status: 'done'
    });

    const forbiddenTitleUpdateResponse = await api
      .put(`/api/tasks/${otherTask.id}`)
      .set(authHeader(manager.token))
      .send({ title: 'Manager changed title' });

    expectError(forbiddenTitleUpdateResponse, 403, 'FORBIDDEN');
  });

  test('allows admins to update and delete another user task', async () => {
    const owner = await createUserAndLogin(api, {
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123',
      role: 'user'
    });

    const admin = await createUserAndLogin(api, {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const task = seedTask(db, {
      title: 'Admin target task',
      user: owner.user
    });

    const updateResponse = await api
      .put(`/api/tasks/${task.id}`)
      .set(authHeader(admin.token))
      .send({
        title: 'Admin updated task',
        description: 'Admin can change every field',
        status: 'done'
      });

    expectSuccess(updateResponse);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data).toMatchObject({
      id: task.id,
      title: 'Admin updated task',
      description: 'Admin can change every field',
      status: 'done'
    });

    const deleteResponse = await api
      .delete(`/api/tasks/${task.id}`)
      .set(authHeader(admin.token));

    expectSuccess(deleteResponse);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data).toEqual({ id: task.id });

    const missingResponse = await api
      .get(`/api/tasks/${task.id}`)
      .set(authHeader(admin.token));

    expectError(missingResponse, 404, 'NOT_FOUND');
  });

  test('validates task input and protects category foreign keys', async () => {
    const user = await createUserAndLogin(api, {
      name: 'Jay',
      email: 'jay@example.com',
      password: 'password123',
      role: 'user'
    });

    const invalidStatusResponse = await api
      .post('/api/tasks')
      .set(authHeader(user.token))
      .send({
        title: 'Invalid status',
        status: 'blocked'
      });

    expectError(invalidStatusResponse, 400, 'VALIDATION_ERROR');
    expect(invalidStatusResponse.body.details).toContain('status must be one of: todo, in_progress, done');

    const missingCategoryResponse = await api
      .post('/api/tasks')
      .set(authHeader(user.token))
      .send({
        title: 'Missing category',
        category_id: 9999
      });

    expectError(missingCategoryResponse, 400, 'FOREIGN_KEY_CONSTRAINT');

    const category = seedCategory(db, 'Testing');

    const validWithCategoryResponse = await api
      .post('/api/tasks')
      .set(authHeader(user.token))
      .send({
        title: 'Categorized task',
        category_id: category.id
      });

    expectSuccess(validWithCategoryResponse);
    expect(validWithCategoryResponse.status).toBe(201);
    expect(validWithCategoryResponse.body.data).toMatchObject({
      title: 'Categorized task',
      category_id: category.id
    });
  });
});
