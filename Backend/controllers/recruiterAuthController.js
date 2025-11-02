const bcrypt = require("bcryptjs");
const generatetoken = require("../utils/generateTokens");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Recruiter Signup
const recruiterSignup = async (req, res) => {
  try {
    const { full_name, email, password, company_name, company_info } = req.body;

    if (!full_name || !email || !password || !company_name) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if recruiter already exists
    const existingRecruiter = await prisma.recruiter.findUnique({ where: { email } });
    if (existingRecruiter) {
      return res.status(400).json({ message: "Recruiter already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        user_type: "recruiter",
        date_joined: new Date(),
      },
    });

    // Create or find company
    let company = await prisma.company.findFirst({ where: { company_name } });
    if (!company) {
      company = await prisma.company.create({
        data: {
          company_name,
          company_info,
        },
      });
    }

    // Create Recruiter
    const recruiter = await prisma.recruiter.create({
      data: {
        user_id: user.user_id,
        full_name,
        email,
        password: hashedPassword,
        company_id: company.company_id,
        date_joined: new Date(),
      },
    });

    res.status(201).json({
      status: true,
      message: "Recruiter registered successfully",
      recruiter,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Recruiter Login
const recruiterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find recruiter
    const recruiter = await prisma.recruiter.findUnique({
      where: { email },
    });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, recruiter.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if recruiter active
    if (!recruiter.is_active) {
      return res.status(403).json({ message: "Your account is deactivated. Contact admin." });
    }

    // Generate JWT token
    const token = generatetoken(recruiter);

    res.status(200).json({
      message: "Login successful",
      token,
      recruiter,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { recruiterSignup, recruiterLogin };
