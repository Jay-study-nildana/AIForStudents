const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responses');
const { validateIdParam, validateTaskInput, validateTaskUpdateInput } = require('../utils/validators');
const {
  canViewAllTasks,
  canCreateTasks,
  isTaskOwner,
  canUpdateTask,
  canDeleteTask
} = require('../middleware/role');

function serializeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    user_id: task.user_id,
    category_id: task.category_id,
    created_at: task.created_at,
    updated_at: task.updated_at
  };
}

function buildUpdateParts(updates) {
  const fields = Object.entries(updates)
    .filter(([, value]) => value !== undefined)
    .map(([field]) => `${field} = ?`);

  if (fields.length === 0) {
    return {
      sql: '',
      values: []
    };
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');

  const values = Object.entries(updates)
    .filter(([, value]) => value !== undefined)
    .map(([, value]) => value);

  return {
    sql: fields.join(', '),
    values
  };
}

function listTasks(req, res, next) {
  try {
    const query = canViewAllTasks(req.user)
      ? 'SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks ORDER BY created_at DESC'
      : 'SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC';

    const tasks = canViewAllTasks(req.user)
      ? db.prepare(query).all()
      : db.prepare(query).all(req.user.id);

    return sendSuccess(res, 200, 'Tasks retrieved successfully', tasks.map(serializeTask));
  } catch (error) {
    return next(error);
  }
}

function createTask(req, res, next) {
  try {
    if (!canCreateTasks(req.user)) {
      return sendError(res, 403, 'Forbidden', null, 'FORBIDDEN');
    }

    const validation = validateTaskInput(req.body);

    if (!validation.valid) {
      return sendError(res, 400, 'Task validation failed', validation.errors, 'VALIDATION_ERROR');
    }

    const result = db
      .prepare(`
        INSERT INTO tasks (title, description, status, user_id, category_id)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        validation.data.title,
        validation.data.description,
        validation.data.status,
        req.user.id,
        validation.data.category_id
      );

    const task = db
      .prepare('SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks WHERE id = ?')
      .get(result.lastInsertRowid);

    return sendSuccess(res, 201, 'Task created successfully', serializeTask(task));
  } catch (error) {
    return next(error);
  }
}

function getTask(req, res, next) {
  try {
    const validation = validateIdParam(req.params);

    if (!validation.valid) {
      return sendError(res, 400, 'Invalid task id', validation.errors, 'VALIDATION_ERROR');
    }

    const task = db
      .prepare('SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks WHERE id = ?')
      .get(validation.id);

    if (!task) {
      return sendError(res, 404, 'Task not found', null, 'NOT_FOUND');
    }

    if (!canViewAllTasks(req.user) && !isTaskOwner(req.user, task)) {
      return sendError(res, 403, 'Forbidden', null, 'FORBIDDEN');
    }

    return sendSuccess(res, 200, 'Task retrieved successfully', serializeTask(task));
  } catch (error) {
    return next(error);
  }
}

function updateTask(req, res, next) {
  try {
    const idValidation = validateIdParam(req.params);

    if (!idValidation.valid) {
      return sendError(res, 400, 'Invalid task id', idValidation.errors, 'VALIDATION_ERROR');
    }

    const task = db
      .prepare('SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks WHERE id = ?')
      .get(idValidation.id);

    if (!task) {
      return sendError(res, 404, 'Task not found', null, 'NOT_FOUND');
    }

    const bodyValidation = validateTaskUpdateInput(req.body);

    if (!bodyValidation.valid) {
      return sendError(res, 400, 'Task validation failed', bodyValidation.errors, 'VALIDATION_ERROR');
    }

    if (!canUpdateTask(req.user, task, bodyValidation.data)) {
      return sendError(res, 403, 'Forbidden', null, 'FORBIDDEN');
    }

    const updateParts = buildUpdateParts(bodyValidation.data);

    if (!updateParts.sql) {
      return sendError(res, 400, 'No update fields provided', null, 'VALIDATION_ERROR');
    }

    db
      .prepare(`UPDATE tasks SET ${updateParts.sql} WHERE id = ?`)
      .run(...updateParts.values, idValidation.id);

    const updatedTask = db
      .prepare('SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks WHERE id = ?')
      .get(idValidation.id);

    return sendSuccess(res, 200, 'Task updated successfully', serializeTask(updatedTask));
  } catch (error) {
    return next(error);
  }
}

function deleteTask(req, res, next) {
  try {
    const validation = validateIdParam(req.params);

    if (!validation.valid) {
      return sendError(res, 400, 'Invalid task id', validation.errors, 'VALIDATION_ERROR');
    }

    const task = db
      .prepare('SELECT id, title, description, status, user_id, category_id, created_at, updated_at FROM tasks WHERE id = ?')
      .get(validation.id);

    if (!task) {
      return sendError(res, 404, 'Task not found', null, 'NOT_FOUND');
    }

    if (!canDeleteTask(req.user, task)) {
      return sendError(res, 403, 'Forbidden', null, 'FORBIDDEN');
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(validation.id);

    return sendSuccess(res, 200, 'Task deleted successfully', { id: validation.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};
