const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const {
  createTask, getTask, reOrderTasks, updateTask,
} = require('../controllers/taskController');

const router = express.Router();

const taskNameValidator = [body('name').isString().trim().isLength({ min: 2 })
  .withMessage('section name must have at least 2 characters')];

router.post('/create', taskNameValidator, isAuth, createTask);
router.get('/:taskId', isAuth, getTask);
router.patch('/:taskId/update', taskNameValidator, isAuth, updateTask);
router.patch('/re-order', isAuth, reOrderTasks);

module.exports = router;
