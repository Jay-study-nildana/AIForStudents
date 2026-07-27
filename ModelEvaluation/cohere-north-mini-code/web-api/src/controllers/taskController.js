const { db } = require('../config/database');

// Helper function to check task ownership and permissions
const canAccessTask = (task, user) => {
  if (!user) return false;
  
  // Admin can access all tasks
  if (user.role === 'admin') return true;
  
  // Manager can access all tasks (except create without category)  
  if (user.role === 'manager') return true;
  
  // Regular user can only access their own tasks
  if (user.role === 'user' && task.user_id === user.id) return true;
  
  return false;
};

// Helper function to get tasks with role-based filtering
const getTasksByRole = (user, isOwner = false) => {
  if (!user) {
    return {
      query: 'SELECT * FROM tasks',
      params: []
    };
  }
  
  if (user.role === 'admin') {
    return {
      query: 'SELECT * FROM tasks',
      params: []
    };
  } else if (user.role === 'manager') {
    return {
      query: 'SELECT * FROM tasks',
      params: []
    };
  } else if (user.role === 'user' && isOwner) {
    return {
      query: 'SELECT * FROM tasks WHERE user_id = ?',
      params: [user.id]
    };
  }
  
  return {
    query: 'SELECT * FROM tasks WHERE 1 = 0',
    params: []
  };
};

// Get all tasks (role-based filtering)
const getAllTasks = (req, res) => {
  try {
    const user = req.user;
    const roleFilter = getTasksByRole(user);
    
    const tasks = db.prepare(roleFilter.query).all(...roleFilter.params);
    
    res.json({
      success: true,
      data: tasks,
      message: `Retrieved ${tasks.length} tasks`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks'
    });
  }
};

// Create task (authenticated)
const createTask = (req, res) => {
  try {
    const { title, description, status, category_id } = req.body;
    const user = req.user;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }
    
    // Check permissions
    if (user.role === 'user' && category_id) {
      return res.status(403).json({
        success: false,
        message: 'Users cannot create tasks with categories'
      });
    }
    
    // Check if category exists (if provided)
    if (category_id) {
      const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      // Check manager/admin permissions for category assignment
      if (user.role === 'user' && category.name.toLowerCase() !== 'general') {
        return res.status(403).json({
          success: false,
          message: 'Users can only assign "general" category'
        });
      }
    }
    
    const result = db.prepare(
      'INSERT INTO tasks (title, description, status, user_id, category_id) VALUES (?, ?, ?, ?, ?)'
    ).run(title, description, status || 'todo', user.id, category_id || null);
    
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
};

// Get single task (role-based access)
const getTaskById = (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check permissions
    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    res.json({
      success: true,
      data: task,
      message: 'Task retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task'
    });
  }
};

// Update task (role-based access)
const updateTask = (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check permissions
    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    // Admins/managers can update status on any task
    // Owners can only update their own tasks
    const { title, description, status, category_id } = req.body;
    
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (category_id !== undefined) updates.category_id = category_id;
    
    updates.updated_at = new Date().toISOString();
    
    const allowedUpdates = Object.keys(updates).filter(key => key !== 'id');
    if (allowedUpdates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    const setClause = allowedUpdates.map(key => `${key} = ?`).join(', ');
    const params = [...Object.values(updates), req.params.id];
    
    db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`).run(...params);
    
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    
    res.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
};

// Delete task (role-based access)
const deleteTask = (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check permissions
    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    
    res.json({
      success: true,
      data: null,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};