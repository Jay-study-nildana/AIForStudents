const request = require('supertest');
const app = require('../server');

describe('Category Endpoints', () => {
  let categoryId;

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Test Category' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Category');
      expect(res.body.data.id).toBeDefined();
      categoryId = res.body.data.id;
    });

    it('should reject duplicate name', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Test Category' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('should reject missing name', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/categories', () => {
    it('should list all categories', async () => {
      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get a single category', async () => {
      const res = await request(app).get(`/api/categories/${categoryId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(categoryId);
      expect(res.body.data.name).toBe('Test Category');
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app)
        .get('/api/categories/00000000-0000-0000-0000-000000000000');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: 'Updated Category' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Category');
    });

    it('should reject update with duplicate name', async () => {
      // Create another category first with unique name
      const createRes = await request(app)
        .post('/api/categories')
        .send({ name: `Another Category ${Date.now()}` });

      expect(createRes.status).toBe(201);

      const res = await request(app)
        .put(`/api/categories/${createRes.body.data.id}`)
        .send({ name: 'Updated Category' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app)
        .put('/api/categories/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Ghost' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Category deleted successfully');
    });

    it('should return 404 when deleting same category again', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
