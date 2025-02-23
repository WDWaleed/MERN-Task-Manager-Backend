const BadRequestError = require("./badRequest");
const NotFoundError = require("./notFound");
const UnauthorizedError = require("./unauthorized");
const CustomAPIError = require("./customApiError");

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  CustomAPIError,
};
