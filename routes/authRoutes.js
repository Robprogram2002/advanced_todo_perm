const express = require('express');
const { body } = require('express-validator');
const { signUpHanlder } = require('../controllers/authController');

const router = express.Router();

const emailValidator = body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail();
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
router.get('/signin', () => {});

module.exports = router;
