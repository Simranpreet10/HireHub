const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const updateCompanyProfile = async (req, res) => {
  const { company_id } = req.params;
  const { company_name, company_info, location, industry_type, website } = req.body;
    const updatedCompany = await prisma.company.update({
      where: {company_id: parseInt(company_id) },
      data: {
        company_name,
        company_info,
        location,
        industry_type,
        website
      },
    });

    res.status(200).json({
      message: "Company profile updated successfully",
      data: updatedCompany,
    });
  
};


module.exports = { updateCompanyProfile };
