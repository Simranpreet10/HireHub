const express = require('express');
const router = express.Router();
const { requestResetPassword, verifyResetPassword } = require('../controllers/resetPasswordController');

router.post('/request', requestResetPassword);
router.post('/verify', verifyResetPassword);

module.exports = router;
