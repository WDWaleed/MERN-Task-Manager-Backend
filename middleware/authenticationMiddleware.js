const { UnauthorizedError } = require("../errors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError("Authentication Failed");
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    if (userId) {
      req.userId = userId;
    } else {
      throw new UnauthorizedError("Authentication Failed");
    }
    next();
  } catch (err) {
    throw new UnauthorizedError("Authentication Failed");
  }
};

module.exports = authenticate;
