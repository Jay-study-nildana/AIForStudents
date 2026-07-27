const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { auth, restrictTo } = require('../middleware/auth');

// Protected task endpoints
router.use(auth);

// Role-based endpoints
router.get('/', restrictTo('user', 'manager', 'admin'), getAllTasks);
router.post('/', restrictTo('user', 'manager', 'admin'), createTask);
router.get('/:id', getTaskById); // Individual task check happens in controller
router.put('/:id', getTaskById); // Use same check for updates
router.delete('/:id', getTaskById); // Use same check for deletes

module.exports = router;