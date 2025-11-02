const express=require("express");
const Router = express.Router();
const { updaterecruiterProfile, getRecruiterProfile } = require("../controllers/updaterecuiter.js");
// Router.get("/getdata", getdata);
Router.get("/:recruiter_id", getRecruiterProfile);
Router.put("/:recruiter_id", updaterecruiterProfile);
module.exports = Router;