const express=require("express");
const router=express.Router();
const {applyForJob}=require("../controllers/applicationController");
const {getUserApplications}=require("../controllers/applicationController");
const {updateApplicationStatus}=require("../controllers/applicationController");

router.post("/apply", applyForJob);
router.get("/user/:userId", getUserApplications);
router.put("/:applicationId/status", updateApplicationStatus);

module.exports=router;