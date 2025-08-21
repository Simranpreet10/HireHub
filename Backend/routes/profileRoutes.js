const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // <- Cloudinary based multer

router.post('/setup', authMiddleware, upload.single("resume"), profileController.createProfile);

router.get('/:userId', authMiddleware, profileController.getProfile);

router.put('/:userId', authMiddleware, upload.single("resume"), profileController.updateProfile);

module.exports = router;
