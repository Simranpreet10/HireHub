const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const toggleRecruiterStatus = async (req, res) => {
    const { recruiter_id } = req.params;
    const { is_active } = req.body;

    const recruiter = await prisma.recruiter.update({
      where: { recruiter_id: parseInt(recruiter_id) },
      data: { is_active }
    });

    res.json({ message: "Recruiter status updated", recruiter });

};

const deleteRecruiter = async (req, res) => {
     const { recruiter_id } = req.params;
  const id = parseInt(recruiter_id);

  // Delete related jobs and applications
  const jobs = await prisma.job.findMany({
    where: { recruiter_id: id },
    select: { job_id: true }
  });

  const jobIds = jobs.map(job => job.job_id);

  if (jobIds.length > 0) {
    await prisma.application.deleteMany({
      where: { job_id: { in: jobIds } }
    });
    await prisma.job.deleteMany({
      where: { recruiter_id: id }
    });
  }

  // Delete recruiter
  await prisma.recruiter.delete({
    where: { recruiter_id: id }
  });
   res.json({ message: "Recruiter and related jobs deleted successfully" });
 
};



module.exports = {
  toggleRecruiterStatus,
  deleteRecruiter,
};
