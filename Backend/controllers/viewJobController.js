const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getJobDetails = async (req, res) => {
  const job_id = parseInt(req.params.job_id);
  if (isNaN(job_id)) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  try {
    const job = await prisma.job.findUnique({
      where: { job_id },
      include: {
        recruiter: {
          include: {
            user: true,
            company: true
          }
        },
        company: true
      }
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getJobDetails };
