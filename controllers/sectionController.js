const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Section, Proyect } = require('../models');
const fordwarErrors = require('../utils/forwarError');

exports.createSection = async (req, res) => {
  const { errors } = validationResult(req);
  try {
    if (errors.length > 0) {
      const error = new Error('Validation Failed');
      error.statusCode = 400;
      error.data = errors;
      throw error;
    }
    const { name, position } = req.body;
    const { proyectId } = req.params;

    const proyect = await Proyect.findByPk(proyectId);

    if (!proyect) {
      const error = new Error('Not proyect found');
      error.statusCode = 400;
      throw error;
    }

    const sections = await Section.findAll({
      where: {
        proyectId,
        order: {
          [Op.gte]: position,
        },
      },
    });

    sections.forEach(async (section) => {
      await section.update({ order: section.order + 1 });
    });

    const newSection = await Section.create({
      name,
      order: position,
      proyectId,
    });

    res.status(200).json({ section: { ...newSection.toJSON(), Tasks: [] } });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.reOrderSection = async (req, res) => {
  const { proyectId } = req.params;
  const { sectionId } = req.body;
  let { actualPosition, newPosition } = req.body;
  actualPosition = +actualPosition;
  newPosition = +newPosition;

  try {
    const sectionsAmount = await Section.count({ where: { proyectId } });

    if (newPosition > sectionsAmount || newPosition < 0) {
      const error = new Error('Bad position');
      error.statusCode = 400;
      throw error;
    }

    if (newPosition > actualPosition) {
      const sections = await Section.findAll({
        where: {
          proyectId,
          order: {
            [Op.gt]: actualPosition,
            [Op.lte]: newPosition,
          },
        },
      });

      sections.forEach(async (section) => {
        await section.update({ order: section.order - 1 });
      });
    } else {
      const sections = await Section.findAll({
        where: {
          proyectId,
          order: {
            [Op.gte]: newPosition,
            [Op.lt]: actualPosition,
          },
        },
      });

      sections.forEach(async (section) => {
        await section.update({ order: section.order + 1 });
      });
    }

    await Section.update({ order: newPosition }, { where: { uuid: sectionId } });

    res.status(200).json({ message: 'order changed' });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.deleteSections = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const section = await Section.findByPk(sectionId);

    if (!section) {
      const error = new Error('Not section found');
      error.statusCode = 404;
      throw error;
    }

    await section.destroy();

    res.status(200).json({ message: 'section deleted successfully' });
  } catch (error) {
    fordwarErrors(error);
  }
};

exports.updateSection = async (req, res) => {
  const { sectionId } = req.params;
  const { name } = req.params;

  try {
    const section = await Section.findByPk(sectionId);

    if (!section) {
      const error = new Error('Not section found');
      error.statusCode = 404;
      throw error;
    }

    section.name = name;
    await section.save();

    res.status(200).json({ message: 'section updated successfully', section });
  } catch (error) {
    fordwarErrors(error);
  }
};
