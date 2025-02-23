const { UnauthorizedError } = require("../errors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("Authentication Failed");
  }

  token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId).select("-password");

    req.user = user;
    req.user.userId = payload.userId;
  } catch (err) {
    throw new UnauthorizedError("Authentication Failed");
  }

  next();
};

module.exports = authenticate;
