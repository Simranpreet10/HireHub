const express=require("express");
const router=express.Router();
const {applyForJob}=require("../controllers/applicationController");
const {getUserApplications}=require("../controllers/applicationController");
const {updateApplicationStatus}=require("../controllers/applicationController");

const { getAllApplications } = require("../controllers/applicationController");


const {withdrawApplication}=require("../controllers/applicationController");


router.post("/apply", applyForJob);
router.get("/user/:userId", getUserApplications);
router.put("/:applicationId/status", updateApplicationStatus);

router.get("/admin/all", getAllApplications); 

router.delete("/:applicationId", withdrawApplication);


module.exports=router;