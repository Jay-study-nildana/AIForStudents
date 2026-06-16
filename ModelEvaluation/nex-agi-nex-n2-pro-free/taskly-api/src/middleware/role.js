const { sendError } = require('../utils/responses');

const ROLE_PERMISSIONS = {
  user: {
    viewOwnTasks: true,
    viewAllTasks: false,
    createTasks: true,
    updateOwnTasks: true,
    updateAnyTask: false,
    updateAnyTaskStatusOnly: false,
    deleteOwnTasks: true,
    deleteAnyTask: false,
    manageUsers: false
  },
  manager: {
    viewOwnTasks: true,
    viewAllTasks: true,
    createTasks: true,
    updateOwnTasks: true,
    updateAnyTask: false,
    updateAnyTaskStatusOnly: true,
    deleteOwnTasks: true,
    deleteAnyTask: false,
    manageUsers: false
  },
  admin: {
    viewOwnTasks: true,
    viewAllTasks: true,
    createTasks: true,
    updateOwnTasks: true,
    updateAnyTask: true,
    updateAnyTaskStatusOnly: true,
    deleteOwnTasks: true,
    deleteAnyTask: true,
    manageUsers: true
  }
};

function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || null;
}

function hasPermission(user, permission) {
  const permissions = getRolePermissions(user && user.role);
  return Boolean(permissions && permissions[permission]);
}

function requireRole(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required', null, 'AUTH_REQUIRED');
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return sendError(res, 403, 'Forbidden', null, 'FORBIDDEN');
  };
}

function requirePermission(permission) {
  return function permissionGuard(req, res, next) {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required', null, 'AUTH_REQUIRED');
    }

    if (hasPermission(req.user, permission)) {
      return next();
    }

    return sendError(res, 403, 'Forbidden', null, 'FORBIDDEN');
  };
}

function canManageUsers(user) {
  return hasPermission(user, 'manageUsers');
}

function canViewAllTasks(user) {
  return hasPermission(user, 'viewAllTasks');
}

function canCreateTasks(user) {
  return hasPermission(user, 'createTasks');
}

function canDeleteAnyTask(user) {
  return hasPermission(user, 'deleteAnyTask');
}

function canUpdateAnyTask(user) {
  return hasPermission(user, 'updateAnyTask');
}

function canUpdateAnyTaskStatusOnly(user) {
  return hasPermission(user, 'updateAnyTaskStatusOnly');
}

function isTaskOwner(user, task) {
  return Number(user.id) === Number(task.user_id);
}

function canUpdateTask(user, task, updates = {}) {
  if (isTaskOwner(user, task) && hasPermission(user, 'updateOwnTasks')) {
    return true;
  }

  if (canUpdateAnyTask(user)) {
    return true;
  }

  if (canUpdateAnyTaskStatusOnly(user)) {
    const updateKeys = Object.keys(updates).filter((key) => updates[key] !== undefined);
    return updateKeys.length > 0 && updateKeys.every((key) => key === 'status');
  }

  return false;
}

function assertCanUpdateTask(user, task, updates = {}) {
  if (!canUpdateTask(user, task, updates)) {
    return false;
  }

  return true;
}

function canDeleteTask(user, task) {
  if (isTaskOwner(user, task) && hasPermission(user, 'deleteOwnTasks')) {
    return true;
  }

  return canDeleteAnyTask(user);
}

module.exports = {
  ROLE_PERMISSIONS,
  getRolePermissions,
  hasPermission,
  requireRole,
  requirePermission,
  canManageUsers,
  canViewAllTasks,
  canCreateTasks,
  canDeleteAnyTask,
  canUpdateAnyTask,
  canUpdateAnyTaskStatusOnly,
  isTaskOwner,
  canUpdateTask,
  assertCanUpdateTask,
  canDeleteTask
};
