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
                created_at: new Date(),
                seen: false,
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

        res.status(201).json({ message:"Application submitted, notification sent and mail delivered."});
    } catch(err){
        console.error("Error in applyForJob: ",err);
        res.status(500).json({error:"Server Error"});
    }
}

async function getUserApplications(req, res){
    try{
        const userId=req.params.userId; //getting value from route

        const applications=await prisma.application.findMany({
            where:{
                user_id: parseInt(userId)
            },
            include:{
                job:{
                    select:{
                        job_title: true,
                        company_id: true,
                        posted_date: true,
                        closing_date: true,
                    }
                }
            }
        });
        res.json(applications);
    }catch(err){
        console.log("Error fetching applications: ", err);
        res.status(500).json({error: "Server Error"});
    }
}

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

        const emailTemplate=`Congratulations! You've advanced to the next round (${newStatus}) for the position (${updatedApplication.job.job_title}).`;
        if(updatedApplication.user && updatedApplication.user.email){
            await sendEmail({
                to: updatedApplication.user.email,
                subject: "You have been shortlisted for the next Round!",
                text: emailTemplate
            });
        }
        res.json({message: "Statud updated, notification sent, and email delivered.", updatedApplication});
    }catch(err){
        console.log("Error updating the application status", err);
        res.status(500).json({error: "Server Error"});
    }
}

module.exports={applyForJob, getUserApplications, updateApplicationStatus};
