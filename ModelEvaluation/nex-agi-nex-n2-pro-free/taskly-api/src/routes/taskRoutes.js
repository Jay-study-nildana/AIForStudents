const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', taskController.listTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
