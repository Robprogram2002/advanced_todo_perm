const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
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
    res.status(200).json({ result: { ...result.toJSON(), Tasks: [] } });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.getTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Task,
          separate: true,
          order: [['order', 'ASC']],
          include: [
            {
              model: Task,
              separate: true,
              order: [['order', 'ASC']],
            },
          ],
        },
        {
          model: Proyect,
          attributes: ['title', 'uuid', 'color'],
        },
      ],
    });

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

exports.reOrderTasks = async (req, res) => {
  const { taskId, entityId, entityType } = req.body;
  let { actualPosition, newPosition } = req.body;
  actualPosition = +actualPosition;
  newPosition = +newPosition;

  const condition = { entityId, entityType };

  try {
    const taskAmount = await Task.count({ where: condition });

    if (newPosition > taskAmount || newPosition < 0) {
      const error = new Error('Bad position');
      error.statusCode = 400;
      throw error;
    }

    if (newPosition > actualPosition) {
      const tasks = await Task.findAll({
        where: {
          ...condition,
          order: {
            [Op.gt]: actualPosition,
            [Op.lte]: newPosition,
          },
        },
      });

      tasks.forEach(async (task) => {
        await task.update({ order: task.order - 1 });
      });
    } else {
      const tasks = await Task.findAll({
        where: {
          ...condition,
          order: {
            [Op.gte]: newPosition,
            [Op.lt]: actualPosition,
          },
        },
      });

      tasks.forEach(async (task) => {
        await task.update({ order: task.order + 1 });
      });
    }

    await Task.update({ order: newPosition }, { where: { uuid: taskId } });

    res.status(200).json({ message: 'order changed' });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.updateTask = async (req, res) => {
  const { errors } = validationResult(req);
  try {
    if (errors.length > 0) {
      const error = new Error('Validation Failed');
      error.statusCode = 400;
      error.data = errors;
      throw error;
    }

    const { name } = req.body;
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    await task.update({ name });

    res.status(200).json({ newTaskName: name });
  } catch (error) {
    fordwarErrors(error);
  }
};
