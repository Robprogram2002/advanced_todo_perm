const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Proyect } = require('../models');
const fordwarErrors = require('../utils/forwarError');

exports.signUpHanlder = async (req, res) => {
  const { errors } = validationResult(req);

  try {
    if (errors.length > 0) {
      const error = new Error('Validation Failed');
      error.statusCode = 400;
      error.data = errors;
      throw error;
    }

    const { username, email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      const error = new Error('Opps ...  Email addres already exist !');
      error.statusCode = 400;
      throw error;
    }

    const encriptPassword = await bcrypt.hash(password, 12);

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
      error.statusCode = 400;
      error.data = errors;
      throw error;
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Proyect, attributes: ['title', 'uuid', 'color'] }],
    });

    if (!user) {
      const error = new Error('No user found with this credentials');
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      const error = new Error('No user found with this credentials!');
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
    const hourMiliSeconds = 60 * 60 * 1000;
    res.status(200).json({
      expirationTime: new Date(new Date().getTime() + hourMiliSeconds),
      token,
      user: user.toJSON(),
      proyects: user.Proyects,
    });
  } catch (error) {
    fordwarErrors(error, res);
  }
};

exports.meHandler = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Proyect, attributes: ['title', 'uuid', 'color'] }],
    });

    if (!user) {
      const error = new Error('Not user authenticated');
      error.statusCode = 401; // anuthorizate
      throw error;
    }

    res.json({
      user: user.toJSON(),
      proyects: user.Proyects,
    });
  } catch (error) {
    fordwarErrors(error);
  }
};
