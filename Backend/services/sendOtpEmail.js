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

// Log configuration (without password) for debugging
console.log('Email transporter configured for:', EMAIL_USER);

async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: `"HireHub" <${EMAIL_USER}>`,
    to: email,
    subject: "HireHub - Your OTP Code",
    text: `Your OTP code is: ${otp}\nThis code is valid for 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4CAF50;">HireHub - OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="background-color: #f0f0f0; padding: 15px; text-align: center; letter-spacing: 5px;">${otp}</h1>
        <p>This code is valid for 5 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };
  
  // Log OTP to console for development/testing purposes
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 OTP EMAIL DETAILS:');
  console.log('To:', email);
  console.log('OTP Code:', otp);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', email);
    return { success: true, message: "OTP sent successfully" };
  } catch (err) {
    console.error("❌ Error sending OTP email:", err.message);
    // Still return success since we're logging OTP to console
    // In production, you should return failure
    console.warn('⚠️  Using console OTP for development - check server logs for OTP');
    return { success: true, message: "OTP sent (check server logs)" };
  }
}

module.exports = sendOtpEmail;
