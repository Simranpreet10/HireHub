const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth"); 
const adminUserController = require("../controllers/adminUserController"); // ✅ controller

router.get("/users", adminAuth, adminUserController.viewAllUsers);
router.get("/user-profiles", adminAuth, adminUserController.viewAllProfiles);
router.get("/user/:user_id", adminAuth, adminUserController.getUserFullProfile);

module.exports = router;
