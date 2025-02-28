const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create(req.body);

  const token = user.createJWT();
  return res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid Credentials");
  }
  const isCorrectPassword = await user.comparePasswords(password);
  console.log(isCorrectPassword);
  if (!isCorrectPassword) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
