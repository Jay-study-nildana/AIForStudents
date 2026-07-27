const express = require('express');
const router = express.Router();

// Authentication endpoints
router.post('/register', (req, res) => {
  res.status(201).json({
    success: true,
    data: { id: Date.now(), ...req.body },
    message: 'User registered successfully'
  });
});

router.post('/login', (req, res) => {
  res.json({
    success: true,
    data: {
      token: 'sample-jwt-token-here',
      user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' }
    },
    message: 'Login successful'
  });
});

module.exports = router;