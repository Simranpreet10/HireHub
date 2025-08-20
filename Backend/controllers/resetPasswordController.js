const bcrypt = require('bcrypt');
const validator = require("validator");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateOtp = require("../utils/generateOtp");
const sendOtpEmail = require("../services/sendOtpEmail");

const resetOtps = new Map();

const requestResetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "No user found with this email" });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  resetOtps.set(email, { otp, expiresAt });
  await sendOtpEmail(email, otp);

  res.status(200).json({ message: "OTP sent to email" });
};

const verifyResetPassword = async (req, res) => {
  const { email, otp, new_password } = req.body;
  if (!email || !otp || !new_password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isStrongPassword(new_password)) {
    return res.status(400).json({ message: "Please provide a strong password" });
  }
  const record = resetOtps.get(email);
  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP invalid or expired" });
  }
  const hashed = await bcrypt.hash(new_password, 10);
  await prisma.user.update({ where: { email }, data: { password: hashed } });
  resetOtps.delete(email);
  res.status(200).json({ message: "Password reset successfully" });
};

module.exports = { requestResetPassword, verifyResetPassword };
