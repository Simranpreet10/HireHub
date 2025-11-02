const {PrismaClient}=require("@prisma/client");
const prisma=new PrismaClient();

const sendEmail=require("../utils/sendEmail");

async function applyForJob(req, res){
    console.log("BODY RECEIVED:", req.body);
    try{
        const {userId, jobId, resume}=req.body;

        const application= await prisma.application.create({
            data:{
                user_id: userId,
                job_id: jobId,
                resume: resume||null,
                status: "Applied",
                apply_date: new Date(),
                last_updated: new Date(),
            },
        });

        //fetching job details
        const job=await prisma.job.findUnique({
            where:{
                job_id:jobId
            },
        });

        if(!job){
            return res.status(404).json({error: "Job not found"});
        }

        const message=`Your application for the position "${job.job_title}" (Job ID: ${jobId}) has been successfully submitted.`;
        await prisma.notification.create({
            data:{
                user_id: userId,
                message,
                notification_type: "Application",
            },
        });

        const user=await prisma.user.findUnique({
            where: {
                user_id:userId
            }
        });

        if(user && user.email){
            await sendEmail({
                to: user.email,
                subject: "Job Application Confirmation",
                text: message,
            });
        }

        res.status(201).json({ 
            message: "Application submitted, notification sent and mail delivered.",
            application: application
        });
    } catch(err){
        console.error("Error in applyForJob: ",err);
        res.status(500).json({error:"Server Error"});
    }
}

const getUserApplications = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId); // ✅ convert to integer

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const applications = await prisma.application.findMany({
      where: {
        user_id: userId, // ✅ correct numeric comparison
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                company_name: true,
                company_logo: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: {
        apply_date: "desc",
      },
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


async function updateApplicationStatus(req, res){
    try{
        const {applicationId}=req.params; //get Id from url
        const {newStatus}=req.body;

        const updatedApplication=await prisma.application.update({
            where:{
                application_id: parseInt(applicationId)
            },
            data:{
                status: newStatus,
                last_updated: new Date()
            },
            include:{
                user: true,
                job: true
            }
        });

        // Different email templates based on status
        let emailSubject = "";
        let emailTemplate = "";
        
        const jobTitle = updatedApplication.job.job_title;
        const userName = updatedApplication.user.full_name || "Candidate";
        
        if (newStatus.toUpperCase() === "REJECTED") {
            emailSubject = "Application Status Update";
            emailTemplate = `Dear ${userName},

Thank you for your interest in the ${jobTitle} position at our company.

We regret to inform you that after careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate the time and effort you invested in the application process. Your resume will be kept on file for future opportunities that may be a better fit for your skills and experience.

We wish you all the best in your job search and future endeavors.

Best regards,
Recruitment Team`;
        } else if (newStatus.toUpperCase() === "ACCEPTED") {
            emailSubject = "Congratulations! Job Offer";
            emailTemplate = `Dear ${userName},

Congratulations! We are pleased to inform you that you have been selected for the ${jobTitle} position.

Your skills, experience, and performance throughout the interview process have impressed us, and we believe you will be a valuable addition to our team.

We will be contacting you shortly with further details regarding the offer, onboarding process, and next steps.

Welcome aboard!

Best regards,
Recruitment Team`;
        } else if (newStatus.toUpperCase() === "SHORTLISTED") {
            emailSubject = "You've been Shortlisted!";
            emailTemplate = `Dear ${userName},

Congratulations! We are pleased to inform you that you have been shortlisted for the ${jobTitle} position.

Your application stood out among many qualified candidates, and we would like to move forward with the next round of our selection process.

We will contact you soon with details about the next steps.

Best regards,
Recruitment Team`;
        } else {
            // Default message for other statuses
            emailSubject = "Application Status Update";
            emailTemplate = `Dear ${userName},

Your application status for the ${jobTitle} position has been updated to: ${newStatus}.

Thank you for your continued interest. We will keep you informed as we progress through our selection process.

Best regards,
Recruitment Team`;
        }

        if(updatedApplication.user && updatedApplication.user.email){
            await sendEmail({
                to: updatedApplication.user.email,
                subject: emailSubject,
                text: emailTemplate
            });
        }
        
        res.json({message: "Status updated, notification sent, and email delivered.", updatedApplication});
    }catch(err){
        console.log("Error updating the application status", err);
        res.status(500).json({error: "Server Error"});
    }
}


// ✅ Get all applications (Admin View)
const getAllApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            mobile_no: true,
            work_status: true,
          },
        },
        job: {
          select: {
            job_id: true,
            job_title: true,
            employment_type: true,
            experience_required: true,
            ctc: true,
            location: true,
            company: {
              select: {
                company_id: true,
                company_name: true,
                location: true,
                company_logo: true,
                industry_type: true,
              },
            },
            recruiter: {
              select: {
                recruiter_id: true,
                full_name: true,
                email: true,
                company: {
                  select: {
                    company_name: true,
                    location: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        apply_date: "desc",
      },
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching all applications:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  applyForJob,
  getUserApplications,
  updateApplicationStatus,
  getAllApplications, 
};

async function withdrawApplication(req, res) {
    try {
        const { applicationId } = req.params;

        // First, get the application details before deleting
        const application = await prisma.application.findUnique({
            where: {
                application_id: parseInt(applicationId)
            },
            include: {
                user: true,
                job: true
            }
        });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Delete the application
        await prisma.application.delete({
            where: {
                application_id: parseInt(applicationId)
            }
        });

        // Send notification
        const message = `Your application for "${application.job.job_title}" has been withdrawn successfully.`;
        await prisma.notification.create({
            data: {
                user_id: application.user_id,
                message,
                notification_type: "Application",
            },
        });

        // Send email notification
        if (application.user && application.user.email) {
            await sendEmail({
                to: application.user.email,
                subject: "Application Withdrawn",
                text: message,
            });
        }

        res.json({ message: "Application withdrawn successfully" });
    } catch (err) {
        console.error("Error withdrawing application:", err);
        console.error("Error details:", err.message);
        console.error("Stack trace:", err.stack);
        res.status(500).json({ 
            error: "Server Error",
            message: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}

module.exports={applyForJob, getUserApplications, updateApplicationStatus, withdrawApplication};

