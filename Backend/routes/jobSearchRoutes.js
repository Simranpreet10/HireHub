const express = require("express");
const router = express.Router();
const jobSearchController = require("../controllers/jobSearchController");

router.get("/search", jobSearchController.searchJobs);
router.get("/getdata", jobSearchController.getAllJobs); // Assuming getdata is also needed
module.exports = router;
