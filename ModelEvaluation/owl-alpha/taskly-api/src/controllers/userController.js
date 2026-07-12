const db = require('../config/database');

function getUsers(req, res) {
  try {
    const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all();

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getUsers };

function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Prevent admin from deleting themselves
    if (id === adminId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Admin cannot delete their own account'
        }
      });
    }

    // Check if user exists
    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getUsers, deleteUser };
