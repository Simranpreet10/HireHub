const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth"); 
const adminUserController = require("../controllers/adminUserController"); //  controller

router.get("/users", adminAuth, adminUserController.viewAllUsers);
router.get("/user-profiles", adminAuth, adminUserController.viewAllProfiles);
router.get("/users/:userId/profile", adminAuth, adminUserController.getUserProfile);
router.delete('/users/:userId/delete', adminAuth, adminUserController.deleteUser);
router.put('/users/:userId/toggle-status', adminAuth, adminUserController.toggleUserStatus);

module.exports = router;
