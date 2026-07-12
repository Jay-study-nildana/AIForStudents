const db = require('../config/database');

function getTasks(req, res) {
  try {
    const { status, category_id, search } = req.query;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Base query with JOINs for owner and category
    let sql = `
      SELECT
        t.id, t.title, t.description, t.status,
        t.user_id, t.category_id,
        t.created_at, t.updated_at,
        u.id AS owner_id, u.name AS owner_name,
        c.id AS cat_id, c.name AS cat_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
    `;

    const conditions = [];
    const params = [];

    // Role filtering: user sees own tasks only
    if (userRole === 'user') {
      conditions.push('t.user_id = ?');
      params.push(userId);
    }

    // Optional status filter
    if (status) {
      conditions.push('t.status = ?');
      params.push(status);
    }

    // Optional category filter
    if (category_id) {
      conditions.push('t.category_id = ?');
      params.push(category_id);
    }

    // Optional search (title or description, case-insensitive)
    if (search) {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY t.created_at DESC';

    const rows = db.prepare(sql).all(...params);

    // Format response to match Contract spec
    const tasks = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      user_id: row.user_id,
      category_id: row.category_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner: { id: row.owner_id, name: row.owner_name },
      category: { id: row.cat_id, name: row.cat_name }
    }));

    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getTasks };

function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Build query with role filtering
    let sql = `
      SELECT
        t.id, t.title, t.description, t.status,
        t.user_id, t.category_id,
        t.created_at, t.updated_at,
        u.id AS owner_id, u.name AS owner_name,
        c.id AS cat_id, c.name AS cat_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `;
    const params = [id];

    // Role filtering: user sees own tasks only
    if (userRole === 'user') {
      sql += ' AND t.user_id = ?';
      params.push(userId);
    }

    const row = db.prepare(sql).get(...params);

    if (!row) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found'
        }
      });
    }

    const task = {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      user_id: row.user_id,
      category_id: row.category_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner: { id: row.owner_id, name: row.owner_name },
      category: { id: row.cat_id, name: row.cat_name }
    };

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error('Get task by id error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getTasks, getTaskById };

function createTask(req, res) {
  try {
    const { title, description, status, category_id } = req.body;
    const userId = req.user.id;

    // Input validation
    const errors = [];
    if (!title || title.trim() === '') errors.push({ field: 'title', message: 'Title is required' });
    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
      errors.push({ field: 'status', message: 'Status must be one of: todo, in_progress, done' });
    }
    if (category_id) {
      const cat = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
      if (!cat) errors.push({ field: 'category_id', message: 'Category not found' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Input validation failed', details: errors }
      });
    }

    // Generate GUID and insert
    const taskId = require('crypto').randomUUID();
    db.prepare(`
      INSERT INTO tasks (id, title, description, status, user_id, category_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      title.trim(),
      description ? description.trim() : null,
      status || 'todo',
      userId,
      category_id || null
    );

    // Fetch the created task with JOINs
    const row = db.prepare(`
      SELECT t.id, t.title, t.description, t.status, t.user_id, t.category_id,
             t.created_at, t.updated_at,
             u.id AS owner_id, u.name AS owner_name,
             c.id AS cat_id, c.name AS cat_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(taskId);

    const task = {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      user_id: row.user_id,
      category_id: row.category_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner: { id: row.owner_id, name: row.owner_name },
      category: { id: row.cat_id, name: row.cat_name }
    };

    return res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  } catch (err) {
    console.error('Create task error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
    });
  }
}

module.exports = { getTasks, getTaskById, createTask };

function updateTask(req, res) {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;
    const { title, description, status, category_id, user_id } = req.body;

    // Find the task
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Task not found' }
      });
    }

    // Determine if user owns this task
    const isOwner = task.user_id === userId;

    // Role-based field restrictions
    let allowedFields = [];

    if (userRole === 'admin') {
      // Admin: full access to any task, including ownership transfer
      allowedFields = ['title', 'description', 'status', 'category_id', 'user_id'];
    } else if (userRole === 'manager') {
      if (isOwner) {
        // Manager on own task: full edit
        allowedFields = ['title', 'description', 'status', 'category_id'];
      } else {
        // Manager on other's task: status ONLY
        allowedFields = ['status'];
      }
    } else {
      // Regular user: full edit on own tasks only
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only update your own tasks' }
        });
      }
      allowedFields = ['title', 'description', 'status', 'category_id'];
    }

    // Build update dynamically based on allowed fields
    const updates = [];
    const params = [];

    if (allowedFields.includes('title') && title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Title cannot be empty', details: [{ field: 'title', message: 'Title cannot be empty' }] }
        });
      }
      updates.push('title = ?');
      params.push(title.trim());
    }

    if (allowedFields.includes('description') && description !== undefined) {
      updates.push('description = ?');
      params.push(description.trim());
    }

    if (allowedFields.includes('status') && status !== undefined) {
      if (!['todo', 'in_progress', 'done'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Status must be one of: todo, in_progress, done', details: [{ field: 'status', message: 'Status must be one of: todo, in_progress, done' }] }
        });
      }
      updates.push('status = ?');
      params.push(status);
    }

    if (allowedFields.includes('category_id') && category_id !== undefined) {
      const cat = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
      if (!cat) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Category not found', details: [{ field: 'category_id', message: 'Category not found' }] }
        });
      }
      updates.push('category_id = ?');
      params.push(category_id);
    }

    if (allowedFields.includes('user_id') && user_id !== undefined) {
      const targetUser = db.prepare('SELECT id FROM users WHERE id = ?').get(user_id);
      if (!targetUser) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Target user not found', details: [{ field: 'user_id', message: 'Target user not found' }] }
        });
      }
      updates.push('user_id = ?');
      params.push(user_id);
    }

    // If manager on other's task and tried to update non-status fields
    if (userRole === 'manager' && !isOwner && (title !== undefined || description !== undefined || category_id !== undefined)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Managers can only update the status of tasks they do not own' }
      });
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No valid fields to update' }
      });
    }

    // Always update the updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    // Fetch updated task with JOINs
    const row = db.prepare(`
      SELECT t.id, t.title, t.description, t.status, t.user_id, t.category_id,
             t.created_at, t.updated_at,
             u.id AS owner_id, u.name AS owner_name,
             c.id AS cat_id, c.name AS cat_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);

    const updatedTask = {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      user_id: row.user_id,
      category_id: row.category_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner: { id: row.owner_id, name: row.owner_name },
      category: { id: row.cat_id, name: row.cat_name }
    };

    return res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (err) {
    console.error('Update task error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
    });
  }
}

module.exports = { getTasks, getTaskById, createTask, updateTask };

function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Find the task
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Task not found' }
      });
    }

    // Role-based access: user/manager can delete own tasks only, admin can delete any
    const isOwner = task.user_id === userId;

    if (userRole === 'user' || userRole === 'manager') {
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only delete your own tasks' }
        });
      }
    }
    // Admin can delete any task — no additional check needed

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
    });
  }
}

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
