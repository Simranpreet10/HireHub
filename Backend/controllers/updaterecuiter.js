const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRecruiterProfile = async (req, res) => {
  const { recruiter_id } = req.params;
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { recruiter_id: parseInt(recruiter_id) },
      include: { company: true },
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
  const { full_name, email, password, is_active, date_joined } = req.body;
  try {
    const updatedRecruiter = await prisma.recruiter.update({
      where: { recruiter_id: parseInt(recruiter_id) },
      data: { full_name, email, password, is_active, date_joined },
    });

    res.status(200).json({
      message: "Recruiter profile updated successfully",
      recruiter: updatedRecruiter,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecruiterProfile, updaterecruiterProfile };
