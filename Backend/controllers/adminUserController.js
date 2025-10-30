const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.viewAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.userProfile.findMany({
      include: { user: true },
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUserFullProfile = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  if (isNaN(user_id)) return res.status(400).json({ message: "Invalid user id" });

  try {
    const user = await prisma.user.findUnique({
      where: { user_id },
      include: {
        profiles: true,
        applications: {
          include: {
            job: {
              include: {
                company: true,
                recruiter: { include: { user: true, company: true } }
              }
            }
          }
        },
        notifications: true,
        resume_alts: true,
        Recruiter: true
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getUserFullProfile error:", err);
    res.status(500).json({ message: err.message });
  }
};