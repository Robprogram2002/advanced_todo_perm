const { validationResult } = require('express-validator');
const {
  Proyect, User, Section, Task,
} = require('../models');
const fordwarErrors = require('../utils/forwarError');

exports.createPost = async (req, res) => {
  const { errors } = validationResult(req);
  try {
    if (errors.length > 0) {
      const error = new Error('Validation Failed');
      error.statusCode = 400;
      error.data = errors;
      throw error;
    }
    const { title, description, color } = req.body;

    const newProyect = await Proyect.create({
      title,
      description,
      color,
      userId: req.userId,
    });

    res.status(200).json({
      message: 'post created successfully',
      proyect: { ...newProyect.toJSON(), Tasks: [], Sections: [] },
    });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.getUserProyects = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: Proyect,
          attributes: ['title', 'color', 'description', 'color', 'uuid'],
          include: [
            { model: User, as: 'creator', attributes: ['username', 'email'] },
            { model: Section, attributes: ['uuid', 'order', 'name'] },
            { model: Task },
          ],
        },
      ],
      attributes: ['username', 'uuid'],
    });

    res.status(200).json({ user });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.getProyect = async (req, res) => {
  const { proyectId } = req.params;

  try {
    const proyect = await Proyect.findByPk(proyectId, {
      include: [{
        model: Section, include: [Task],
      }, Task],
    });

    if (proyect.userId !== req.userId) {
      const error = new Error('Not authorizated ');
      error.statusCode = 404;
      throw error;
    }
    console.log(proyect);
    res.status(200).json({ proyect });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.deleteProyect = async (req, res) => {
  const { proyectId } = req.params;

  try {
    const proyect = await Proyect.findByPk(proyectId);

    if (proyect.userId !== req.userId) {
      const error = new Error('Not authorizated ');
      error.statusCode = 404;
      throw error;
    }

    await proyect.destroy();

    res.status(200).json({ message: 'proyect deleted successfully' });
  } catch (error) {
    fordwarErrors(error);
  }
};
