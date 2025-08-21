const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProfile = async (req, res) => {
  try {
    const { user_id, skills, marks_10, marks_12, marks_graduation, location, email, additional_info } = req.body;
    
    // Resume URL from Cloudinary (via multer)
    let resumeUrl = req.file ? req.file.path : null;
    
    // Check if profile already exists for this user_id
    const existingProfile = await prisma.userProfile.findFirst({
      where: { user_id: parseInt(user_id) },
    });
    
    if (existingProfile) {
      const updatedProfile = await prisma.userProfile.update({
        where: { profile_id: existingProfile.profile_id },
        data: {
          skills,
          marks_10: marks_10 ? parseFloat(marks_10) : existingProfile.marks_10,
          marks_12: marks_12 ? parseFloat(marks_12) : existingProfile.marks_12,
          marks_graduation: marks_graduation ? parseFloat(marks_graduation) : existingProfile.marks_graduation,
          location,
          email,
          resume: resumeUrl || existingProfile.resume, // Keep old resume if no new file uploaded
          additional_info,
        },
      });
      return res.status(200).json({ message: 'Profile updated', profile: updatedProfile });
    }
    
    const profile = await prisma.userProfile.create({
      data: {
        user_id: parseInt(user_id),
        skills,
        marks_10: marks_10 ? parseFloat(marks_10) : null,
        marks_12: marks_12 ? parseFloat(marks_12) : null,
        marks_graduation: marks_graduation ? parseFloat(marks_graduation) : null,
        location,
        email,
        resume: resumeUrl,
        additional_info,
      },
    });
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await prisma.userProfile.findFirst({
      where: { user_id: parseInt(userId) },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skills, marks_10, marks_12, marks_graduation, location, email, additional_info } = req.body;
    
    // Resume URL from Cloudinary (via multer)
    let resumeUrl = req.file ? req.file.path : null;
    
    // Find the profile by user_id
    const existingProfile = await prisma.userProfile.findFirst({
      where: { user_id: parseInt(userId) },
    });
    
    if (!existingProfile) return res.status(404).json({ error: 'Profile not found' });

    // Prepare update data
    const updateData = {
      skills,
      marks_10: marks_10 ? parseFloat(marks_10) : existingProfile.marks_10,
      marks_12: marks_12 ? parseFloat(marks_12) : existingProfile.marks_12,
      marks_graduation: marks_graduation ? parseFloat(marks_graduation) : existingProfile.marks_graduation,
      location,
      email,
      additional_info,
    };
    
    // Only update resume if new file is uploaded
    if (resumeUrl) {
      updateData.resume = resumeUrl;
    }

    // Update using profile_id
    const profile = await prisma.userProfile.update({
      where: { profile_id: existingProfile.profile_id },
      data: updateData,
    });
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
