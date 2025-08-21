const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: true,
        recruiter: true,
      },
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const { job_title, location, employment_type, company_name, page = 1, limit = 10 } = req.query;

    const filters = {
      ...(job_title && { job_title: { contains: job_title, mode: "insensitive" } }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
      ...(employment_type && { employment_type: { contains: employment_type, mode: "insensitive" } }),
      ...(company_name && { company: { company_name: { contains: company_name, mode: "insensitive" } } }),
    };

    const jobs = await prisma.job.findMany({
      where: filters,
      include: { company: true, recruiter: true },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
