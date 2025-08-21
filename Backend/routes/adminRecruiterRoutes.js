const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const adminRecruiterController = require("../controllers/adminRecruiterController");

router.get("/recruiters", adminAuth, adminRecruiterController.viewAllRecruiters);
router.get("/companies", adminAuth, adminRecruiterController.viewAllCompanies);

module.exports = router;
