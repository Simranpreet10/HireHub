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


const toggleUserStatus = async (req, res) => {
    const { user_id } = req.params;
    const { is_active } = req.body;

    const user = await prisma.user.update({
      where: { user_id: parseInt(user_id) },
      data: { is_active }
    });

    res.json({ message: "User status updated", user });

};


const editUser = async (req, res) => {
    const { user_id } = req.params;
    const { full_name, email, password, mobile_no, work_status ,user_type } = req.body;

    const user = await prisma.user.update({
      where: { user_id: parseInt(user_id) },
      data: { full_name, email, password, mobile_no, work_status ,user_type}
    });

    res.json({ message: "User updated", user });
  
};


const deleteUser = async (req, res) => {
 
   const { user_id } = req.params;
    const id = parseInt(user_id);
   await prisma.userProfile.deleteMany({ where: { user_id: id } });
    await prisma.application.deleteMany({ where: { user_id: id } });
    await prisma.notification.deleteMany({ where: { user_id: id } });
    await prisma.resumeAlt.deleteMany({ where: { user_id: id } });
    await prisma.recruiter.deleteMany({ where: { user_id: id } });

    await prisma.user.delete({
      where: { user_id: id}
    });

    res.json({ message: "User deleted" });
  
};

module.exports = {
  toggleRecruiterStatus,
  deleteRecruiter,
  toggleUserStatus,
  editUser,
  deleteUser
};
