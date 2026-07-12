const db = require('../config/database');

function getCategories(req, res) {
  try {
    const categories = db.prepare('SELECT id, name, created_at FROM categories ORDER BY created_at DESC').all();

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getCategories };

function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    const category = db.prepare('SELECT id, name, created_at FROM categories WHERE id = ?').get(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Category not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error('Get category by id error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getCategories, getCategoryById };

function createCategory(req, res) {
  try {
    const { name } = req.body;

    // Input validation
    const errors = [];
    if (!name || name.trim() === '') errors.push({ field: 'name', message: 'Category name is required' });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors
        }
      });
    }

    // Check for duplicate name
    const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A category with this name already exists'
        }
      });
    }

    // Generate GUID and insert
    const categoryId = require('crypto').randomUUID();
    db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)').run(categoryId, name.trim());

    const category = db.prepare('SELECT id, name, created_at FROM categories WHERE id = ?').get(categoryId);

    return res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (err) {
    console.error('Create category error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getCategories, getCategoryById, createCategory };

function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Input validation
    const errors = [];
    if (!name || name.trim() === '') errors.push({ field: 'name', message: 'Category name is required' });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors
        }
      });
    }

    // Check if category exists
    const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Category not found'
        }
      });
    }

    // Check for duplicate name (excluding current category)
    const duplicate = db.prepare('SELECT id FROM categories WHERE name = ? AND id != ?').get(name.trim(), id);
    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A category with this name already exists'
        }
      });
    }

    // Update
    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name.trim(), id);

    const category = db.prepare('SELECT id, name, created_at FROM categories WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (err) {
    console.error('Update category error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getCategories, getCategoryById, createCategory, updateCategory };

function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Check if category exists
    const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Category not found'
        }
      });
    }

    // Delete the category
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Delete category error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
