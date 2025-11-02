// controllers/adminRecruiterController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.viewAllRecruiters = async (req, res) => {
  try {
    const recruiters = await prisma.recruiter.findMany({
      include: { company: true }
    });
    res.json(recruiters);
  } catch (error) {
    console.error("viewAllRecruiters:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecruiterProfile = async (req, res) => {
  try {
    const recruiterId = parseInt(req.params.recruiterId, 10);
    if (isNaN(recruiterId)) return res.status(400).json({ message: "Invalid recruiter id" });

    const recruiter = await prisma.recruiter.findUnique({
      where: { recruiter_id: recruiterId },
      include: { company: true, jobs: true, user: true }
    });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    res.json(recruiter);
  } catch (error) {
    console.error("getRecruiterProfile:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.toggleRecruiterStatus = async (req, res) => {
  try {
    const recruiterId = parseInt(req.params.recruiterId, 10);
    if (isNaN(recruiterId)) return res.status(400).json({ message: "Invalid recruiter id" });

    // Fetch current record
    const recruiter = await prisma.recruiter.findUnique({
      where: { recruiter_id: recruiterId },
      select: { recruiter_id: true, is_active: true }
    });

    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const updated = await prisma.recruiter.update({
      where: { recruiter_id: recruiterId },
      data: { is_active: !recruiter.is_active },
      select: {
        recruiter_id: true,
        full_name: true,
        email: true,
        company_id: true,
        is_active: true,
        date_joined: true
      }
    });

    res.json({
      message: `Recruiter ${updated.is_active ? "activated" : "deactivated"} successfully`,
      recruiter: updated
    });
  } catch (error) {
    console.error("toggleRecruiterStatus:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecruiter = async (req, res) => {
  try {
    const recruiterId = parseInt(req.params.recruiterId, 10);
    if (isNaN(recruiterId)) return res.status(400).json({ message: "Invalid recruiter id" });

    // Optionally delete jobs/applications in transaction before deleting recruiter
    await prisma.$transaction(async (tx) => {
      // delete jobs
      await tx.job.deleteMany({ where: { recruiter_id: recruiterId } });
      // delete recruiter
      await tx.recruiter.delete({ where: { recruiter_id: recruiterId } });
    });

    res.json({ message: "Recruiter and their jobs deleted successfully" });
  } catch (error) {
    console.error("deleteRecruiter:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.viewAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    console.error("viewAllCompanies:", error);
    res.status(500).json({ error: error.message });
  }
};
