const express=require("express");
const Router = express.Router();
const {updaterecruiterProfile } = require("../controllers/updaterecuiter.js");
// Router.get("/getdata", getdata);
Router.put("/:recruiter_id",updaterecruiterProfile);
module.exports = Router;