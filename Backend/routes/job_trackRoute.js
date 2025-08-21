const express = require('express');
const {getJobsWithApplicants,  getApplicantsByJob,  getApplicationDetails} = require('../controllers/Job_tracking.js');
const router = express.Router();

router.get("/applicants", getJobsWithApplicants);
router.get("/:jobId", getApplicantsByJob);
router.get("/application/:applicationId", getApplicationDetails);

module.exports = router;