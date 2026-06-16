function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toOptionalString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function validateIdParam(params, paramName = 'id') {
  const errors = [];
  const rawValue = params[paramName];

  if (!rawValue) {
    errors.push(`${paramName} is required`);
    return { valid: false, errors };
  }

  const id = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(id) || id <= 0 || String(id) !== String(rawValue)) {
    errors.push(`${paramName} must be a positive integer`);
  }

  return {
    valid: errors.length === 0,
    errors,
    id: errors.length === 0 ? id : undefined
  };
}

function validateCategoryInput(body) {
  const errors = [];
  const name = toOptionalString(body.name);

  if (!name) {
    errors.push('name is required');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? { name } : {}
  };
}

function validateAuthInput(body) {
  const errors = [];
  const name = toOptionalString(body.name);
  const email = toOptionalString(body.email);
  const password = toOptionalString(body.password);
  const role = toOptionalString(body.role);

  if (!name) {
    errors.push('name is required');
  }

  if (!email) {
    errors.push('email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('email must be valid');
  }

  if (!password) {
    errors.push('password is required');
  } else if (password.length < 6) {
    errors.push('password must be at least 6 characters');
  }

  if (role && !['user', 'manager', 'admin'].includes(role)) {
    errors.push('role must be one of: user, manager, admin');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? { name, email, password, role: role || 'user' } : {}
  };
}

function validateLoginInput(body) {
  const errors = [];
  const email = toOptionalString(body.email);
  const password = toOptionalString(body.password);

  if (!email) {
    errors.push('email is required');
  }

  if (!password) {
    errors.push('password is required');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? { email, password } : {}
  };
}

function validateTaskInput(body) {
  const errors = [];
  const title = toOptionalString(body.title);
  const description = toOptionalString(body.description);
  const status = toOptionalString(body.status);
  const categoryId = body.category_id === undefined || body.category_id === null || body.category_id === ''
    ? undefined
    : Number.parseInt(body.category_id, 10);

  if (!title) {
    errors.push('title is required');
  }

  if (status && !['todo', 'in_progress', 'done'].includes(status)) {
    errors.push('status must be one of: todo, in_progress, done');
  }

  if (categoryId !== undefined && (!Number.isInteger(categoryId) || categoryId <= 0 || String(categoryId) !== String(body.category_id))) {
    errors.push('category_id must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0
      ? {
          title,
          description,
          status: status || 'todo',
          category_id: categoryId
        }
      : {}
  };
}

function validateTaskUpdateInput(body) {
  const errors = [];
  const title = toOptionalString(body.title);
  const description = body.description === undefined ? undefined : toOptionalString(body.description);
  const status = toOptionalString(body.status);
  const categoryId = body.category_id === undefined || body.category_id === null || body.category_id === ''
    ? undefined
    : Number.parseInt(body.category_id, 10);

  if (title === undefined && description === undefined && status === undefined && categoryId === undefined) {
    errors.push('at least one field is required');
  }

  if (status && !['todo', 'in_progress', 'done'].includes(status)) {
    errors.push('status must be one of: todo, in_progress, done');
  }

  if (categoryId !== undefined && (!Number.isInteger(categoryId) || categoryId <= 0 || String(categoryId) !== String(body.category_id))) {
    errors.push('category_id must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0
      ? {
          title,
          description,
          status,
          category_id: categoryId
        }
      : {}
  };
}

module.exports = {
  isNonEmptyString,
  toOptionalString,
  validateIdParam,
  validateCategoryInput,
  validateAuthInput,
  validateLoginInput,
  validateTaskInput,
  validateTaskUpdateInput
};
