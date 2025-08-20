const nodemailer = require("nodemailer");
require('dotenv').config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: `"HireHub" <${EMAIL_USER}>`,
    to: email,
    subject: "OTP",
    text: `Your OTP code is: ${otp}\nThis code is valid for 5 minutes.`
  };
  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (err) {
    console.error("Error sending OTP email:", err);
    return { success: false, message: "Failed to send OTP email" };
  }
}

module.exports = sendOtpEmail;
