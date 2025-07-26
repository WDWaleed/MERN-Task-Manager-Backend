const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors");
const sendEmail = require("../utils/sendEmail");
const { generateVerificationEmail } = require("../utils/emailTemplates");

const register = async (req, res) => {
  const user = await User.create(req.body);

  const token = user.createJWT();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    partitioned: process.env.NODE_ENV === "production" ? true : false,
  });

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.verificationOtp = otp;
  user.verificationOtpExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const html = generateVerificationEmail(user, otp);

  await sendEmail({
    to: user.email,
    subject: "Account Verification OTP",
    html,
  });

  return res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, message: "Registration Successful!" });
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

  if (!user.isAccountVerified) {
    throw new UnauthorizedError("Your account is unverified");
  }

  const isCorrectPassword = await user.comparePasswords(password);
  if (!isCorrectPassword) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    partitioned: process.env.NODE_ENV === "production" ? true : false,
  });

  await User.findByIdAndUpdate(user._id, { lastLogin: Date.now() });

  return res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, message: "Logged In!" });
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

const sendVerificationOtp = async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.isAccountVerified) {
    return res.status(StatusCodes.OK).send("Account already verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.verificationOtp = otp;
  user.verificationOtpExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const html = generateVerificationEmail(user, otp);

  await sendEmail({
    to: user.email,
    subject: "Account Verification OTP",
    html,
  });

  return res.status(StatusCodes.OK).send("Verification OTP sent");
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const { userId } = req;

  if (!userId || !otp) {
    throw new BadRequestError("OTP or User ID not provided");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  if (user.verificationOtpExpires < Date.now()) {
    user.verificationOtp = "";
    user.verificationOtpExpires = 0;
    await user.save();
    throw new UnauthorizedError("OTP Expired");
  }

  if (user.verificationOtp === "" || user.verificationOtp !== otp) {
    throw new UnauthorizedError("Incorrect OTP");
  }

  user.isAccountVerified = true;
  user.verificationOtp = "";
  user.verificationOtpExpires = 0;

  await user.save();
  return res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      isAccountVerified: user.isAccountVerified,
    },
    message: "Email verified successfully",
  });
};

const isAuthenticated = async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.isAccountVerified) {
    throw new UnauthorizedError("Your account is unverified");
  }

  return res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      isAccountVerified: user.isAccountVerified,
    },
  });
};

const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.OK).json({
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.resetOtp = otp;
  user.resetOtpExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const html = generateVerificationEmail(user, otp);

  await sendEmail({
    to: user.email,
    subject: "Account Verification OTP",
    html,
  });

  return res.status(StatusCodes.OK).send("Reset OTP sent");
};

const resetPassword = async (req, res) => {
  const { email, otp, password: newPass } = req.body;
  console.log(req.body);
  if (!email || !otp || !newPass) {
    throw new BadRequestError("Please provide all the required values");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(StatusCodes.OK).json({
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  }

  if (user.resetOtpExpires < Date.now()) {
    throw new UnauthorizedError("OTP has expired. Please request a new one");
  }

  if (user.resetOtp === "" || user.resetOtp !== otp) {
    throw new UnauthorizedError("Invalid OTP");
  }

  user.password = newPass;
  user.resetOtp = "";
  user.resetOtpExpires = 0;

  user.save();

  return res.status(200).json({ message: "Password reset was successful" });
};

module.exports = {
  register,
  login,
  logout,
  sendVerificationOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
};
