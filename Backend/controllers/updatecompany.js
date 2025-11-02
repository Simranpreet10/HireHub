



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCompanyProfile = async (req, res) => {
  try {
    const { company_name, company_info, location, industry_type, website } = req.body;
    const company = await prisma.company.create({
      data: { company_name, company_info, location, industry_type, website },
    });
    res.status(201).json({ message: "Company profile created successfully", company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCompanyProfile = async (req, res) => {
  const { company_id } = req.params;
  try {
    const company = await prisma.company.findUnique({
      where: { company_id: parseInt(company_id) },
    });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCompanyProfile = async (req, res) => {
  const { company_id } = req.params;
  const { company_name, company_info, location, industry_type, website } = req.body;
  try {
    const updatedCompany = await prisma.company.update({
      where: { company_id: parseInt(company_id) },
      data: { company_name, company_info, location, industry_type, website },
    });
    res.status(200).json({
      message: "Company profile updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCompanyProfile, getCompanyProfile, updateCompanyProfile };
