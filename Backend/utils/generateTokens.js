const jwt = require("jsonwebtoken");
const generateToken = (user)=>{
    // Include user details in token payload (excluding password)
    const payload = {
        user_id: user.user_id,
        recruiter_id: user.recruiter_id, // For recruiters
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        mobile_no: user.mobile_no,
        work_status: user.work_status,
        company_id: user.company_id // For recruiters
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = generateToken;