const request = require('supertest');

const {
  setupApp,
  teardownApp,
  expectSuccess,
  expectError
} = require('./helpers');

describe('Category API', () => {
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

  test('lists categories as an empty collection for a fresh database', async () => {
    const response = await api.get('/api/categories');

    expectSuccess(response);
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  test('creates, retrieves, updates, and deletes a category', async () => {
    const createResponse = await api
      .post('/api/categories')
      .send({ name: 'Development' });

    expectSuccess(createResponse);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toMatchObject({
      id: expect.any(Number),
      name: 'Development'
    });

    const categoryId = createResponse.body.data.id;

    const getResponse = await api.get(`/api/categories/${categoryId}`);

    expectSuccess(getResponse);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data).toMatchObject({
      id: categoryId,
      name: 'Development'
    });

    const updateResponse = await api
      .put(`/api/categories/${categoryId}`)
      .send({ name: 'Backend' });

    expectSuccess(updateResponse);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data).toMatchObject({
      id: categoryId,
      name: 'Backend'
    });

    const deleteResponse = await api.delete(`/api/categories/${categoryId}`);

    expectSuccess(deleteResponse);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data).toEqual({ id: categoryId });

    const missingResponse = await api.get(`/api/categories/${categoryId}`);

    expectError(missingResponse, 404, 'NOT_FOUND');
  });

  test('rejects category names that are missing or already used', async () => {
    const missingNameResponse = await api
      .post('/api/categories')
      .send({});

    expectError(missingNameResponse, 400, 'VALIDATION_ERROR');
    expect(missingNameResponse.body.message).toBe('Category validation failed');
    expect(missingNameResponse.body.details).toContain('name is required');

    const firstResponse = await api
      .post('/api/categories')
      .send({ name: 'Design' });

    expectSuccess(firstResponse);

    const duplicateResponse = await api
      .post('/api/categories')
      .send({ name: 'Design' });

    expectError(duplicateResponse, 409, 'UNIQUE_CONSTRAINT');
  });

  test('returns validation errors for invalid category ids', async () => {
    const response = await api.get('/api/categories/not-an-id');

    expectError(response, 400, 'VALIDATION_ERROR');
    expect(response.body.message).toBe('Invalid category id');
    expect(response.body.details).toContain('id must be a positive integer');
  });
});
