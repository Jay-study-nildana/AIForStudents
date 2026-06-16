const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responses');
const { validateAuthInput, validateLoginInput } = require('../utils/validators');

function getJwtSecret() {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }

  return process.env.JWT_SECRET || 'dev-secret-change-me';
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
  );
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
}

async function register(req, res, next) {
  try {
    const validation = validateAuthInput(req.body);

    if (!validation.valid) {
      return sendError(res, 400, 'Registration validation failed', validation.errors, 'VALIDATION_ERROR');
    }

    const passwordHash = await bcrypt.hash(validation.data.password, 10);
    const result = db
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(validation.data.name, validation.data.email, passwordHash, validation.data.role);

    const user = db
      .prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
      .get(result.lastInsertRowid);

    const token = signToken(user);

    return sendSuccess(res, 201, 'User registered successfully', {
      user: serializeUser(user),
      token
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const validation = validateLoginInput(req.body);

    if (!validation.valid) {
      return sendError(res, 400, 'Login validation failed', validation.errors, 'VALIDATION_ERROR');
    }

    const user = db
      .prepare('SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?')
      .get(validation.data.email);

    if (!user) {
      return sendError(res, 401, 'Invalid credentials', null, 'AUTH_FAILED');
    }

    const passwordMatches = await bcrypt.compare(validation.data.password, user.password_hash);

    if (!passwordMatches) {
      return sendError(res, 401, 'Invalid credentials', null, 'AUTH_FAILED');
    }

    const token = signToken(user);

    return sendSuccess(res, 200, 'Login successful', {
      user: serializeUser(user),
      token
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
