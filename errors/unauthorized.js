const CustomAPIError = require("./customApiError");
const { StatusCodes } = require("http-status-codes");

class Unauthorized extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
