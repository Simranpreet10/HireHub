const express = require("express");
const router = express.Router();
const {
  getJobDetails,
  toggleJobStatus,
  deleteJob,
} = require("../controllers/viewJobController");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        recruiter: { include: { user: true, company: true } },
        company: true,
      },
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get job by ID
router.get("/:job_id", getJobDetails);

// ✅ Toggle status
router.put("/:job_id/status", toggleJobStatus);

// ✅ Delete job
router.delete("/:job_id", deleteJob);

module.exports = router;
