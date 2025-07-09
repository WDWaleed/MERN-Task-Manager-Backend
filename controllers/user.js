const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const User = require("../models/User");

const getUserData = async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);

  if (!user) {
    throw NotFoundError("User not found");
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    userData: {
      name: user.name,
      isAccountVerified: user.isAccountVerified,
    },
  });
};

module.exports = { getUserData };
