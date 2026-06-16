const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.post('/', categoryController.createCategory);
router.get('/:id', categoryController.getCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
