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
exports.getUserProfile = async (req, res) => {
  try {
    const rawId = req.params.userId;
    console.log("getUserProfile called for:", rawId);

    const userId = parseInt(rawId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        profiles: true,         // UserProfile[] relation name from your schema
        applications: {
          include: { job: { include: { company: true } } }
        },
        resume_alts: true,
        notifications: true,
        Recruiter: true
      }
    });

    if (!user) {
      console.log("User not found for id:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Normalize shape for frontend ease (optional)
    const result = {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      mobile_no: user.mobile_no,
      work_status: user.work_status,
      user_type: user.user_type,
      is_active: user.is_active,
      date_joined: user.date_joined,
      profiles: user.profiles || [],
      applications: user.applications || [],
      resume_alts: user.resume_alts || [],
      notifications: user.notifications || [],
      recruiter_rows: user.Recruiter || []
    };

    console.log("Returning user profile for:", userId);
    res.json(result);
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
  }
};

exports.deleteUser= async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Delete user and related data in transaction
      await prisma.$transaction(async (tx) => {
        // Delete related records first
        await tx.application.deleteMany({
          where: { user_id: userId }
        });

        await tx.userProfile.deleteMany({
          where: { user_id: userId }
        });

        // Finally delete the user
        await tx.user.delete({
          where: { user_id: userId }
        });
      });

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ 
        message: "Failed to delete user",
        error: error.message 
      });
    }
  }



   exports.toggleUserStatus= async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Get current user status
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        select: { is_active: true }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Toggle status
      const updatedUser = await prisma.user.update({
        where: { user_id: userId },
        data: { is_active: !user.is_active },
        select: {
          user_id: true,
          full_name: true,
          email: true,
          is_active: true
        }
         });

      res.json({
        message: `User ${updatedUser.is_active ? 'activated' : 'deactivated'} successfully`,
        user: updatedUser
      });
    } catch (error) {
      console.error("Toggle user status error:", error);
      res.status(500).json({ 
        message: "Failed to toggle user status",
        error: error.message 
      });
    }
  }
