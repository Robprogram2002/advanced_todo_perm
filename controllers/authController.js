const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const fordwarErrors = require('../utils/forwarError');

exports.signUpHanlder = async (req, res) => {
  const { errors } = validationResult(req);

  if (errors.length > 0) {
    const error = new Error('Validation Failed');
    error.statusCode = 422;
    error.data = errors;
    throw error;
  }

  const { username, email, password } = req.body;
  const encriptPassword = await bcrypt.hash(password, 12);
  try {
    await User.create({
      username,
      email,
      password: encriptPassword,
    });

    res.json({ message: 'acount created successfully' });
  } catch (error) {
    fordwarErrors(error, res);
  }
};

exports.signInHandler = async (req, res) => {
  const { errors } = validationResult(req);

  try {
    if (errors.length > 0) {
      const error = new Error('Validation Failed');
      error.statusCode = 422;
      error.data = errors;
      throw error;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user.uuid,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXP },
    );

    res.status(200).json({
      token,
      user: {
        username: user.username,
        imageUrl: user.imageUrl,

      },
    });
  } catch (error) {
    fordwarErrors(error, res);
  }
};

exports.meHandler = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('Not user authenticated');
      error.statusCode = 401; // anuthorizate
      throw error;
    }

    res.json(user.toJSON());
  } catch (error) {
    fordwarErrors(error);
  }
};
