const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const {
  toggleRecruiterStatus,
  deleteRecruiter,

} = require( "../controllers//adminapporvalController.js");

// Recruiter APIs
router.put("/recruiter/:recruiter_id/status",adminAuth, toggleRecruiterStatus);
router.delete("/recruiter/:recruiter_id",adminAuth, deleteRecruiter);



module.exports = router;
