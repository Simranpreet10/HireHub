const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRecruiterJobs = async (req, res) => {
  const recruiter_id = parseInt(req.params.recruiter_id);
  if (isNaN(recruiter_id)) {
    return res.status(400).json({ message: "Invalid recruiter ID" });
  }
  try {
    const jobs = await prisma.job.findMany({
      where: { recruiter_id },
      include: { company: true } // Optional: includes company details with each job
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecruiterJobs };
