const express=require("express");
const Router = express.Router();
const { createCompanyProfile, updateCompanyProfile, getCompanyProfile } = require("../controllers/updatecompany.js");
// Router.get("/getdata",getdata);
Router.post("/company", createCompanyProfile);
Router.get("/company/:company_id", getCompanyProfile);
Router.put("/company/:company_id", updateCompanyProfile);
module.exports = Router;