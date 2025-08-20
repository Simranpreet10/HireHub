const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const postJob = async (req, res) => {
  const recruiter_id = parseInt(req.params.recruiter_id);
  const {
    company_id,
    job_title,
    description,
    ctc,
    location,
    closing_date,
    eligibility,
    employment_type,
    experience_required
  } = req.body;
  if (!recruiter_id || !company_id || !job_title) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newJob = await prisma.job.create({
      data: {
        recruiter_id,
        company_id,
        job_title,
        description,
        ctc,
        location,
        posted_date: new Date(),
        closing_date,
        eligibility,
        employment_type,
        experience_required
      }
    });
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateJob = async (req, res) => {
  const recruiter_id = parseInt(req.params.recruiter_id);
  const job_id = parseInt(req.params.job_id);
  const updateFields = req.body;

  if (!recruiter_id || !job_id) {
    return res.status(400).json({ message: "Invalid recruiter or job ID" });
  }
  try {
    
    const job = await prisma.job.findUnique({ where: { job_id } });
    if (!job || job.recruiter_id !== recruiter_id) {
      return res.status(403).json({ message: "Forbidden: Not your job" });
    }
    const updatedJob = await prisma.job.update({
      where: { job_id },
      data: updateFields
    });
    res.json({ message: "Job updated", job: updatedJob });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteJob = async (req, res) => {
  const recruiter_id = parseInt(req.params.recruiter_id);
  const job_id = parseInt(req.params.job_id);

  if (!recruiter_id || !job_id) {
    return res.status(400).json({ message: "Invalid recruiter or job ID" });
  }
  try {
    
    const job = await prisma.job.findUnique({ where: { job_id } });
    if (!job || job.recruiter_id !== recruiter_id) {
      return res.status(403).json({ message: "Forbidden: Not your job" });
    }
    await prisma.job.delete({ where: { job_id } });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { postJob, updateJob, deleteJob };
