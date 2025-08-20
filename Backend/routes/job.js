const express = require('express');
const router = express.Router();
const { postJob, updateJob, deleteJob } = require('../controllers/jobController');


router.post('/recruiter/:recruiter_id/job', postJob);


router.put('/recruiter/:recruiter_id/job/:job_id', updateJob);


router.delete('/recruiter/:recruiter_id/job/:job_id', deleteJob);

module.exports = router;
