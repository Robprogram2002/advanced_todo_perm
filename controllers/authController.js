const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.signUpHanlder = async (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length > 0) {
    console.log(errors);
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
    console.log(error);
    next(error);
  }
};

exports.signInHandler = async (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length > 0) {
    console.log(errors);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('asnduiasnd');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('asnduiasnd');
    }

    const token = jwt.sign(
      {
        username: user.username,
        uuid: user.uuid,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      process.env.TOKEN_EXP,
    );

    res.status(200).json({
      token,
      user: {
        username: user.username,
        imageUrl: user.imageUrl,

      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
