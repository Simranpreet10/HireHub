const express = require("express");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// const getdata=async(req,res)=>{
//   const recruiters = await prisma.recruiter.findMany();
//   res.status(200).json({
//     message: "Recruiters fetched successfully",
//     data: recruiters,
//   });
// }
const updaterecruiterProfile = async (req, res) => {
  const { recruiter_id } = req.params;
  const { full_name, email, password, is_active ,date_joined} = req.body;

  const updatedRecruiter = await prisma.recruiter.update({
    where: { recruiter_id: parseInt(recruiter_id) },
    data: { full_name, email, password, is_active ,date_joined},
  });

  res.status(200).json({
    message: "Recruiter profile updated successfully",
    data: updatedRecruiter,
  });
};

module.exports = { updaterecruiterProfile };
