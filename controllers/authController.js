const { validationResult } = require('express-validator');

exports.signUpHanlder = async (req, res, next) => {
//   const { username, email, password } = req.body;
  const errors = validationResult(req);

  if (errors) {
    console.log(errors);
  }

  try {
    res.json({ message: 'acount created successfully' });
  } catch (error) {
    next(error);
  }
};
