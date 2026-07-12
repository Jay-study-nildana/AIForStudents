const request = require('supertest');
const app = require('../server');

describe('Task Endpoints', () => {
  let adminToken, userToken, taskId, userTaskId;

  beforeAll(async () => {
    // Login admin
    const admin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@taskly.local', password: 'admin123' });
    adminToken = admin.body.data.token;

    // Register a regular user
    const user = await request(app)
      .post('/api/auth/register')
      .send({ name: 'TaskUser', email: `taskuser_${Date.now()}@test.com`, password: 'pass123' });
    userToken = user.body.data.token;

    // Create a task as admin
    const adminTask = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Admin Task', description: 'Created by admin' });
    taskId = adminTask.body.data.id;

    // Create a task as regular user
    const userTask = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'User Task', description: 'Created by user' });
    userTaskId = userTask.body.data.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a task with auth', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'New Task', description: 'A test task' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Task');
      expect(res.body.data.status).toBe('todo'); // default status
      expect(res.body.data.owner).toBeDefined();
    });

    it('should reject task creation without auth', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'No Auth Task' });

      expect(res.status).toBe(401);
    });

    it('should reject missing title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'No title' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Bad Status', status: 'invalid' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid category_id', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Bad Cat', category_id: '00000000-0000-0000-0000-000000000000' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks for admin', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should return only own tasks for regular user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // User should see only their own task
      res.body.data.forEach(task => {
        expect(task.user_id).toBeDefined();
      });
    });

    it('should reject without auth', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/tasks?status=todo')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach(task => {
        expect(task.status).toBe('todo');
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a task by id (admin)', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(taskId);
      expect(res.body.data.owner).toBeDefined();
      expect(res.body.data.category).toBeDefined();
    });

    it('should get own task (regular user)', async () => {
      const res = await request(app)
        .get(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(userTaskId);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .get('/api/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update own task (user)', async () => {
      const res = await request(app)
        .put(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'User Updated', status: 'in_progress' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('User Updated');
      expect(res.body.data.status).toBe('in_progress');
    });

    it('should update any task (admin)', async () => {
      const res = await request(app)
        .put(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Admin Updated' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Admin Updated');
    });

    it('should return 403 updating other user task (regular user)', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Hacked' });

      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Ghost' });

      expect(res.status).toBe(404);
    });

    it('should reject without auth', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'No Auth' });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete own task (user)', async () => {
      // Create a fresh task to delete
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'To Delete' });

      const res = await request(app)
        .delete(`/api/tasks/${createRes.body.data.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should delete any task (admin)', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 403 deleting other user task (regular user)', async () => {
      // taskId belongs to admin
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .delete('/api/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should reject without auth', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(401);
    });
  });
});
