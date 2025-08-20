const express = require('express');
const router = express.Router();
const { signup, signupVerify, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signup/verify', signupVerify);
router.post('/login', login);

module.exports = router;
