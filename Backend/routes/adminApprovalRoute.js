const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const {
  toggleRecruiterStatus,
  deleteRecruiter,
  toggleUserStatus,
  editUser,
  deleteUser
} = require( "../controllers//adminapporvalController.js");

// Recruiter APIs
router.put("/recruiter/:recruiter_id/status",adminAuth, toggleRecruiterStatus);
router.delete("/recruiter/:recruiter_id",adminAuth, deleteRecruiter);

// User APIs
router.put("/user/:user_id/status",adminAuth, toggleUserStatus);
router.put("/user/:user_id", adminAuth,editUser);
router.delete("/user/:user_id",adminAuth, deleteUser);

module.exports = router;
