const express = require('express');
const router = express.Router();
const { getJobDetails } = require('../controllers/viewJobController');


const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Route to get ALL jobs (for admin dashboard)
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

router.get('/:job_id', getJobDetails);

module.exports = router;



