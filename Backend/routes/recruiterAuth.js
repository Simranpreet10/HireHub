const express = require("express");
const router = express.Router();
const { recruiterLogin,recruiterSignup } = require("../controllers/recruiterAuthController.js");

router.post("/register", recruiterSignup);
router.post("/login", recruiterLogin);

module.exports = router;