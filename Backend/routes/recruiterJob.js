const express = require('express');
const router = express.Router();
const {getRecruiterJobs}  = require('../controllers/recruiterJobController');

router.get('/recruiter/:recruiter_id/jobs', getRecruiterJobs);

module.exports = router;
