const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Input validation
    const errors = [];
    if (!name || name.trim() === '') errors.push({ field: 'name', message: 'Name is required' });
    if (!email || email.trim() === '') errors.push({ field: 'email', message: 'Email is required' });
    if (!password || password.length < 6) errors.push({ field: 'password', message: 'Password must be at least 6 characters' });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors
        }
      });
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A user with this email already exists'
        }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate GUID for new user
    const userId = crypto.randomUUID();

    // Insert user into database
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, 'user')
    `).run(userId, name.trim(), email.trim().toLowerCase(), passwordHash);

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email: email.trim().toLowerCase(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Fetch the created user (without password)
    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(userId);

    return res.status(201).json({
      success: true,
      data: { user, token },
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { register };

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Input validation
    const errors = [];
    if (!email || email.trim() === '') errors.push({ field: 'email', message: 'Email is required' });
    if (!password || password.trim() === '') errors.push({ field: 'password', message: 'Password is required' });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors
        }
      });
    }

    // Find user by email
    const user = db.prepare('SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password_hash from response
    delete user.password_hash;

    return res.status(200).json({
      success: true,
      data: { user, token },
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { register, login };
