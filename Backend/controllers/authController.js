const bcrypt = require('bcrypt');
const validator = require("validator");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateOtp = require("../utils/generateOtp");
const sendOtpEmail = require("../services/sendOtpEmail");
const generatetoken = require("../utils/generateTokens");

const pendingSignups = new Map();

const signup = async (req, res) => {
  const { full_name, email, password, mobile_no, work_status, user_type } = req.body;

  if (!full_name || !email || !password || !user_type) {
    return res.status(400).json({ message: "Please add all mandatory fields" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please provide correct email" });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: "Please provide strong password" });
  }
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  pendingSignups.set(email, {
    signupDetails: { full_name, email, password, mobile_no, work_status, user_type },
    otp,
    expiresAt,
  });
  await sendOtpEmail(email, otp);
  res.status(200).json({ message: "OTP sent to email" });
};

const signupVerify = async (req, res) => {
  const { email, otp } = req.body;
  const pending = pendingSignups.get(email);
  if (!pending || pending.expiresAt < Date.now() || pending.otp !== otp) {
    return res.status(400).json({ message: "OTP invalid or expired" });
  }
  const hashedPassword = await bcrypt.hash(pending.signupDetails.password, 10);
  await prisma.user.create({
    data: {
      ...pending.signupDetails,
      password: hashedPassword,
      date_joined: new Date()
    }
  });
  pendingSignups.delete(email);
  res.status(201).json({ message: "User registered successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All details are required" });
  }
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      return res.status(400).json({ message: "No user found" });
    }
    const isvalid = await bcrypt.compare(password, userExists.password);
    if (!isvalid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = generatetoken(userExists);
    return res.status(200).json({ message: "LoggedIn", token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { signup, signupVerify, login };
