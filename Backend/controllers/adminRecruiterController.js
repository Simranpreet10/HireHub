const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.viewAllRecruiters = async (req, res) => {
  try {
    const recruiters = await prisma.recruiter.findMany();
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
