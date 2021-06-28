const { validationResult } = require('express-validator');

const { Task, Proyect, Section } = require('../models');
const fordwarErrors = require('../utils/forwarError');

exports.createTask = async (req, res) => {
  const { errors } = validationResult(req);
  try {
    if (errors.length > 0) {
      const error = new Error('Validation Failed');
      error.statusCode = 400;
      error.data = errors;
      throw error;
    }

    const { name, entityType, entityId } = req.body;
    const taskAmount = await Task.count({ where: { entityType, entityId } });

    const taskData = {
      name,
      entityType,
      entityId,
      order: taskAmount,
    };

    let result;

    if (entityType === 'Proyect') {
      const proyect = await Proyect.findByPk(entityId);
      result = await proyect.createTask(taskData);
    } else if (entityType === 'Section') {
      const section = await Section.findByPk(entityId);
      result = await section.createTask(taskData);
    } else {
      const task = await Task.findByPk(entityId);
      result = await task.createTask(taskData);
    }

    res.status(200).json({ result });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.getTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByPk(taskId, { include: [Task] });

    if (!task) {
      const error = new Error('Not task found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ task });
  } catch (error) {
    fordwarErrors(error);
  }
};
