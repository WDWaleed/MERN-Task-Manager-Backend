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
    console.log(userId);
    if (userId) {
      req.userId = userId;
    } else {
      throw new UnauthorizedError("Authentication Failed");
    }
    next();
  } catch (err) {
    throw new UnauthorizedError("Authentication Failed");
  }
  // BELOW WAS BEFORE I SET UP COOKIES
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  //   throw new UnauthorizedError("Authentication Failed");
  // }

  // token = authHeader.split(" ")[1];

  // try {
  //   const payload = jwt.verify(token, process.env.JWT_SECRET);

  //   const user = await User.findById(payload.userId).select("-password");

  //   req.user = user;
  //   req.user.userId = payload.userId;
  // } catch (err) {
  //   throw new UnauthorizedError("Authentication Failed");
  // }
};

module.exports = authenticate;
