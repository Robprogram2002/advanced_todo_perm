const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const {
  createPost, getUserProyects, getProyect, deleteProyect,
} = require('../controllers/proyectController');
const {
  createSection, reOrderSection, deleteSections, updateSection,
} = require('../controllers/sectionController');

const route = express.Router();

route.post(
  '/create',
  [
    body('title')
      .isString()
      .isLength({ min: 3, max: 60 })
      .trim()
      .withMessage('title must be at least 3 characters'),
    body('description').isString().trim(),
    body('color').isString().notEmpty(),
  ],
  isAuth,
  createPost,
);
route.get('/all', isAuth, getUserProyects);
route.get('/:proyectId', isAuth, getProyect);
route.delete('/:proyectId', isAuth, deleteProyect);

const sectionNameValidator = [body('name').isString().trim().isLength({ min: 2, max: 100 })
  .withMessage('section name must have at least 2 characters')];

route.post(
  '/:proyectId/section/create',
  sectionNameValidator,
  isAuth,
  createSection,
);

route.patch('/:proyectId/section/re-order', isAuth, reOrderSection);

route.delete('/section/:sectionId', isAuth, deleteSections);

route.patch('/section/:sectionId', sectionNameValidator, isAuth, updateSection);

module.exports = route;
