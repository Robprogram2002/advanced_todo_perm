const express = require('express');
const { body } = require('express-validator');
const {
  signInHandler,
  signUpHanlder,
  meHandler,
} = require('../controllers/authController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const emailValidator = body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail();
const passwordValidator = body('password').trim().isLength({ min: 6, max: 30 });

router.post(
  '/signup',
  [
    emailValidator,
    passwordValidator,
    body('username').trim().isLength({ min: 4, max: 20 }),
  ],
  signUpHanlder,
);
router.post('/signin', [emailValidator, passwordValidator], signInHandler);

router.get('/me', isAuth, meHandler);

module.exports = router;
