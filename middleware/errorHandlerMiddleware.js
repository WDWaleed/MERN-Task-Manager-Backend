const { StatusCodes } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong. Please try again later.",
  };

  if (err.name == "ValidationError") {
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(". ");
  }

  if (err.code == 11000) {
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = `Duplicate value provided for ${Object.keys(
      err.keyValue
    ).join(", ")}`;
  }

  // console.log(error.message);

  return res.status(error.statusCode).json({ msg: error.message });
};

module.exports = errorHandler;
