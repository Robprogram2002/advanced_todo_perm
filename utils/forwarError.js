const fordwarErrors = (error, res) => {
  const status = error.statusCode || 500;
  const responseObject = { message: error.message };
  if (error.data) {
    responseObject.data = error.data;
  }

  res.status(status).json(responseObject);
};

module.exports = fordwarErrors;
