// routes/adminRecruiterRoutes.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const adminRecruiterController = require("../controllers/adminRecruiterController");

router.get("/recruiters", adminAuth, adminRecruiterController.viewAllRecruiters);
router.get("/recruiters/:recruiterId/profile", adminAuth, adminRecruiterController.getRecruiterProfile);
router.put("/recruiters/:recruiterId/toggle-status", adminAuth, adminRecruiterController.toggleRecruiterStatus); // PUT
router.delete("/recruiters/:recruiterId", adminAuth, adminRecruiterController.deleteRecruiter);
router.get("/companies", adminAuth, adminRecruiterController.viewAllCompanies);

module.exports = router;
