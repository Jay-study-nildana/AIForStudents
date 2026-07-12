/**
 * Check if a user can edit a task
 * - user: can edit own tasks only
 * - manager: can edit own tasks + status on any task
 * - admin: can edit any task
 */
export function canEditTask(user, task) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (task.user_id === user.id) return true;
  return false;
}

/**
 * Check if a user can delete a task
 * - user: can delete own tasks only
 * - manager: can delete own tasks only
 * - admin: can delete any task
 */
export function canDeleteTask(user, task) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (task.user_id === user.id) return true;
  return false;
}

/**
 * Check if a user can change status of any task
 * - manager: can change status of any task
 * - admin: can change status of any task
 */
export function canChangeStatus(user) {
  if (!user) return false;
  return user.role === 'manager' || user.role === 'admin';
}

/**
 * Check if user can manage categories (view the categories page)
 */
export function canManageCategories(user) {
  if (!user) return false;
  return user.role === 'manager' || user.role === 'admin';
}
