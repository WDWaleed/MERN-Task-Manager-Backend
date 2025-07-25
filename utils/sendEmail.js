const transporter = require("../config/nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
