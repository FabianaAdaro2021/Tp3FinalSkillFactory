const errorHandler = (err, req, res, next) => {
  console.log("Error handler");
  const error = new Error("Not found");
  error.status = 404;
  next(error);
};
module.exports = { errorHandler };
