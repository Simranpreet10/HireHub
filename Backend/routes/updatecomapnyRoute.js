const express=require("express");
const Router = express.Router();
const {updateCompanyProfile} = require("../controllers/updatecompany.js");

Router.put("/:company_id", updateCompanyProfile);
module.exports = Router;