const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors");
const transporter = require("../config/nodemailer");

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

  // Sending welcome email
  const { name, email } = req.body;
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Welcome to my MERN Task Manager",
    html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Email Template</title>
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f7;
                      font-family: Arial, sans-serif;
                      color: #333333;
                    }
                    .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      border-radius: 8px;
                      overflow: hidden;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    .header {
                      background-color: #4f46e5;
                      color: #ffffff;
                      text-align: center;
                      padding: 20px;
                    }
                    .content {
                      padding: 30px;
                    }
                    .content h1 {
                      font-size: 24px;
                      margin-top: 0;
                      color: #111827;
                    }
                    .content p {
                      font-size: 16px;
                      line-height: 1.5;
                    }
                    .button {
                      display: inline-block;
                      margin-top: 20px;
                      padding: 12px 20px;
                      background-color: #4f46e5;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 4px;
                      font-weight: bold;
                    }
                    .footer {
                      text-align: center;
                      font-size: 12px;
                      color: #999999;
                      padding: 20px;
                    }
                    @media screen and (max-width: 600px) {
                      .content {
                        padding: 20px;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h2>MERN Task Manager</h2>
                    </div>
                    <div class="content">
                      <h1>Hello, ${name}!</h1>
                      <p>
                        We wanted to let you know that your account has been successfully created.
                      </p>
                      <p>
                        If this was you, please confirm your action below:
                      </p>
                      <a href="[YOUR_LINK_HERE]" class="button">Take Action</a>
                      <p style="margin-top: 30px;">
                        If you didn’t request this, you can safely ignore this email.
                      </p>
                    </div>
                    <div class="footer">
                      &copy; 2025 MERN Task Manager. All rights reserved.<br>
                    </div>
                  </div>
                </body>
                </html>
  `,
  };

  await transporter.sendMail(mailOptions);

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.verificationOtp = otp;
  user.verificationOtpExpires = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, msg: "Registration Successful!" });
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
    .json({ user: { name: user.name }, msg: "Logged In!" });
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

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Account Verification OTP",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Verification OTP</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: Arial, sans-serif;
      color: #333333;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .content {
      padding: 30px;
    }
    .content h1 {
      font-size: 24px;
      margin-top: 0;
      color: #111827;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
    }
    .otp-code {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 24px;
      background-color: #f3f4f6;
      border-radius: 4px;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #4f46e5;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      padding: 20px;
    }
    @media screen and (max-width: 600px) {
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>MERN Task Manager</h2>
    </div>
    <div class="content">
      <h1>Hello, ${user.name}!</h1>
      <p>
        Here’s your verification code to complete your action:
      </p>
      <div class="otp-code">
        ${otp}
      </div>
      <p>
        Enter this code in the app to verify your account. This code will expire in 24 hours for security purposes.
      </p>
      <p style="margin-top: 30px;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      &copy; 2025 MERN Task Manager. All rights reserved.<br>
    </div>
  </div>
</body>
</html>
`,
  };

  await transporter.sendMail(mailOptions);
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
    msg: "Email verified successfully",
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

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Password Reset OTP",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Verification OTP</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: Arial, sans-serif;
      color: #333333;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .content {
      padding: 30px;
    }
    .content h1 {
      font-size: 24px;
      margin-top: 0;
      color: #111827;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
    }
    .otp-code {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 24px;
      background-color: #f3f4f6;
      border-radius: 4px;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #4f46e5;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      padding: 20px;
    }
    @media screen and (max-width: 600px) {
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>MERN Task Manager</h2>
    </div>
    <div class="content">
      <h1>Hello, ${user.name}!</h1>
      <p>
        Here's your otp for resetting your password:
      </p>
      <div class="otp-code">
        ${otp}
      </div>
      <p>
        Enter this code in the app to reset your password. This code will expire in 24 hours for security purposes.
      </p>
      <p style="margin-top: 30px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      &copy; 2025 MERN Task Manager. All rights reserved.<br>
    </div>
  </div>
</body>
</html>
`,
  };

  await transporter.sendMail(mailOptions);
  return res.status(StatusCodes.OK).send("Reset OTP sent");
};

const resetPassword = async (req, res) => {
  const { email, otp, newPass } = req.body;
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

  return res
    .status(200)
    .json({ success: true, message: "Password reset was successful" });
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
