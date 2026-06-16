const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responses');
const { validateCategoryInput, validateIdParam } = require('../utils/validators');

function listCategories(req, res, next) {
  try {
    const categories = db
      .prepare('SELECT id, name, created_at FROM categories ORDER BY name ASC')
      .all();

    return sendSuccess(res, 200, 'Categories retrieved successfully', categories);
  } catch (error) {
    return next(error);
  }
}

function createCategory(req, res, next) {
  try {
    const validation = validateCategoryInput(req.body);

    if (!validation.valid) {
      return sendError(res, 400, 'Category validation failed', validation.errors, 'VALIDATION_ERROR');
    }

    const result = db
      .prepare('INSERT INTO categories (name) VALUES (?)')
      .run(validation.data.name);

    const category = db
      .prepare('SELECT id, name, created_at FROM categories WHERE id = ?')
      .get(result.lastInsertRowid);

    return sendSuccess(res, 201, 'Category created successfully', category);
  } catch (error) {
    return next(error);
  }
}

function getCategory(req, res, next) {
  try {
    const validation = validateIdParam(req.params);

    if (!validation.valid) {
      return sendError(res, 400, 'Invalid category id', validation.errors, 'VALIDATION_ERROR');
    }

    const category = db
      .prepare('SELECT id, name, created_at FROM categories WHERE id = ?')
      .get(validation.id);

    if (!category) {
      return sendError(res, 404, 'Category not found', null, 'NOT_FOUND');
    }

    return sendSuccess(res, 200, 'Category retrieved successfully', category);
  } catch (error) {
    return next(error);
  }
}

function updateCategory(req, res, next) {
  try {
    const idValidation = validateIdParam(req.params);

    if (!idValidation.valid) {
      return sendError(res, 400, 'Invalid category id', idValidation.errors, 'VALIDATION_ERROR');
    }

    const bodyValidation = validateCategoryInput(req.body);

    if (!bodyValidation.valid) {
      return sendError(res, 400, 'Category validation failed', bodyValidation.errors, 'VALIDATION_ERROR');
    }

    const result = db
      .prepare('UPDATE categories SET name = ? WHERE id = ?')
      .run(bodyValidation.data.name, idValidation.id);

    if (result.changes === 0) {
      return sendError(res, 404, 'Category not found', null, 'NOT_FOUND');
    }

    const category = db
      .prepare('SELECT id, name, created_at FROM categories WHERE id = ?')
      .get(idValidation.id);

    return sendSuccess(res, 200, 'Category updated successfully', category);
  } catch (error) {
    return next(error);
  }
}

function deleteCategory(req, res, next) {
  try {
    const validation = validateIdParam(req.params);

    if (!validation.valid) {
      return sendError(res, 400, 'Invalid category id', validation.errors, 'VALIDATION_ERROR');
    }

    const result = db
      .prepare('DELETE FROM categories WHERE id = ?')
      .run(validation.id);

    if (result.changes === 0) {
      return sendError(res, 404, 'Category not found', null, 'NOT_FOUND');
    }

    return sendSuccess(res, 200, 'Category deleted successfully', { id: validation.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};
