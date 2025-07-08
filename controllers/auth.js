const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");
const transporter = require("../config/nodemailer");

const register = async (req, res) => {
  const user = await User.create(req.body);

  const token = user.createJWT();
  // return res.status(StatusCodes.OK).json({ user: { name: user.name }, token });Using cookies now

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
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

  return res.status(StatusCodes.OK).json({ user: { name: user.name } });
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
  // res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.status(StatusCodes.OK).json({ user: { name: user.name } });
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

module.exports = { register, login, logout };
