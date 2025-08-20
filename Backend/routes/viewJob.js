const express = require('express');
const router = express.Router();
const { getJobDetails } = require('../controllers/viewJobController');

router.get('/:job_id', getJobDetails);

module.exports = router;
