const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRecruiterProfile = async (req, res) => {
  const { recruiter_id } = req.params;
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { recruiter_id: parseInt(recruiter_id) },
      include: { 
        company: true,
        user: true // Include user to get mobile_no
      },
    });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json({ message: "Recruiter profile fetched", recruiter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updaterecruiterProfile = async (req, res) => {
  const { recruiter_id } = req.params;
  const { full_name, email, password, mobile_no } = req.body;
  
  try {
    // First get the recruiter to find the user_id
    const recruiter = await prisma.recruiter.findUnique({
      where: { recruiter_id: parseInt(recruiter_id) },
    });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Prepare update data for recruiter (only fields that exist in Recruiter model)
    const recruiterData = {};
    if (full_name) recruiterData.full_name = full_name;
    if (email) recruiterData.email = email;
    if (password) recruiterData.password = password;

    // Update recruiter
    const updatedRecruiter = await prisma.recruiter.update({
      where: { recruiter_id: parseInt(recruiter_id) },
      data: recruiterData,
    });

    // Update user table if mobile_no is provided
    if (mobile_no !== undefined) {
      await prisma.user.update({
        where: { user_id: recruiter.user_id },
        data: { mobile_no },
      });
    }

    // Fetch complete updated profile
    const completeProfile = await prisma.recruiter.findUnique({
      where: { recruiter_id: parseInt(recruiter_id) },
      include: { user: true, company: true },
    });

    res.status(200).json({
      message: "Recruiter profile updated successfully",
      recruiter: completeProfile,
    });
  } catch (err) {
    console.error("Error updating recruiter profile:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecruiterProfile, updaterecruiterProfile };
