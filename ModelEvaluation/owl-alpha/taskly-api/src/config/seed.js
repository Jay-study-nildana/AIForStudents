const db = require('./database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seedDatabase() {
  // Check if admin already exists
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@taskly.local');
  if (existingAdmin) {
    console.log('Seed data already exists. Skipping.');
    return;
  }

  // Create admin user with known GUID
  const adminId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const passwordHash = await bcrypt.hash('admin123', 10);

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(adminId, 'Admin', 'admin@taskly.local', passwordHash, 'admin');

  console.log('Admin user created: admin@taskly.local / admin123');

  // Create regular user with known GUID
  const userId = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';
  const userPasswordHash = await bcrypt.hash('user123', 10);

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, 'User', 'user@taskly.local', userPasswordHash, 'user');

  console.log('Regular user created: user@taskly.local / user123');

  // Create default categories with known GUIDs
  const categories = [
    { id: 'f7e8d9c0-a1b2-4c3d-8e9f-0a1b2c3d4e5f', name: 'Work' },
    { id: 'a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', name: 'Personal' },
    { id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', name: 'Shopping' }
  ];

  const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
  for (const cat of categories) {
    insertCategory.run(cat.id, cat.name);
  }

  console.log('Default categories created: Work, Personal, Shopping');
  console.log('Seeding complete.');
}

module.exports = { seedDatabase };
