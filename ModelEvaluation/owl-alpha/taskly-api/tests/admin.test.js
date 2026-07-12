const request = require('supertest');
const app = require('../server');

describe('Admin User Management', () => {
  let adminToken, userToken, targetUserId;

  beforeAll(async () => {
    // Login admin
    const admin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@taskly.local', password: 'admin123' });
    adminToken = admin.body.data.token;

    // Register a regular user to be the target of admin operations
    const user = await request(app)
      .post('/api/auth/register')
      .send({ name: 'TargetUser', email: `target_${Date.now()}@test.com`, password: 'pass123' });
    userToken = user.body.data.token;
    targetUserId = user.body.data.id;
  });

  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
      // Verify no password_hash in response
      res.body.data.forEach(user => {
        expect(user.password_hash).toBeUndefined();
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.role).toBeDefined();
      });
    });

    it('should return 403 for regular user', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user (admin)', async () => {
      // Create a fresh user to delete
      const u = await request(app)
        .post('/api/auth/register')
        .send({ name: 'ToDelete', email: `todelete_${Date.now()}@test.com`, password: 'pass123' });
      const deleteId = u.body.data.user.id;

      const res = await request(app)
        .delete(`/api/users/${deleteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User deleted successfully');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .delete('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 when admin tries to delete self', async () => {
      // Get admin user id
      const users = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      const adminId = users.body.data.find(u => u.role === 'admin').id;

      const res = await request(app)
        .delete(`/api/users/${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toBe('Admin cannot delete their own account');
    });

    it('should return 403 for regular user', async () => {
      // Register another user first
      const u = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Another', email: `another_${Date.now()}@test.com`, password: 'pass123' });

      const res = await request(app)
        .delete(`/api/users/${u.body.data.user.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .delete('/api/users/some-id');

      expect(res.status).toBe(401);
    });
  });
});
