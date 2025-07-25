const generateVerificationEmail = (user, otp) => {
  return `<!DOCTYPE html>
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
      margin: 20px auto;
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
      <p>Here’s your verification code to complete your action:</p>
      <div class="otp-code">${otp}</div>
      <p>
        Enter this code in the app to verify your account.
        This code will expire in 24 hours.
      </p>
      <p style="margin-top: 30px;">If you didn’t request this, ignore it.</p>
    </div>
    <div class="footer">
      &copy; 2025 MERN Task Manager. All rights reserved.<br>
    </div>
  </div>
</body>
</html>`;
};

const generatePasswordResetEmail = (user, otp) => {
  return `<!DOCTYPE html>
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
`;
};

module.exports = { generateVerificationEmail, generatePasswordResetEmail };
