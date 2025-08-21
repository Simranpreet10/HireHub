const express=require("express");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetches all jobs from the database.
const getJobsWithApplicants = async (req, res) => {
    const jobs = await prisma.job.findMany({
      include: {
        company: true,   
        recruiter: true, 
        applications: {
          include: {
            user: true  
          }
        }
      }
    });

    res.json(jobs);

};

//Fetches a single job by its jobId.
const getApplicantsByJob = async (req, res) => {
  const { jobId } = req.params;

 
    const job = await prisma.job.findUnique({
      where: { job_id: Number(jobId) },
      include: {
        applications: {
          include: {
            user: true  
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);

};

//Fetches a specific application by its applicationId.
const getApplicationDetails = async (req, res) => {
  const { applicationId } = req.params;
    const application = await prisma.application.findUnique({
      where: { application_id: Number(applicationId) },
      include: {
        user: true,  
        job: true    
      }
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);

};
module.exports = {
getJobsWithApplicants,
  getApplicantsByJob,
  getApplicationDetails
};  