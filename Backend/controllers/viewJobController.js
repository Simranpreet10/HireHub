const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getJobDetails = async (req, res) => {
  const job_id = parseInt(req.params.job_id);
  if (isNaN(job_id)) return res.status(400).json({ message: "Invalid job id" });

  try {
    const job = await prisma.job.findUnique({
      where: { job_id },
      include: {
        recruiter: {
          include: { user: true, company: true },
        },
        company: true,
      },
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleJobStatus = async (req, res) => {
  const job_id = parseInt(req.params.job_id, 10);
  if (Number.isNaN(job_id)) return res.status(400).json({ message: "Invalid job id" });

  try {
    console.log("toggleJobStatus called for job_id:", job_id);
    const job = await prisma.job.findUnique({ where: { job_id } });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const updated = await prisma.job.update({
      where: { job_id },
      data: { is_active: !Boolean(job.is_active) },
    });

    console.log("Job toggled:", updated.job_id, "is_active:", updated.is_active);
    return res.json({ message: `Job ${updated.is_active ? "activated" : "deactivated"}`, job: updated });
  } catch (err) {
    console.error("toggleJobStatus error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const deleteJob = async (req, res) => {
  const job_id = parseInt(req.params.job_id);
  if (isNaN(job_id)) return res.status(400).json({ message: "Invalid job id" });

  try {
    await prisma.application.deleteMany({ where: { job_id } });
    await prisma.job.delete({ where: { job_id } });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getJobDetails, toggleJobStatus, deleteJob };
