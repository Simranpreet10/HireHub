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
