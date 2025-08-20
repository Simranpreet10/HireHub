const generateOtp = require("../utils/generateOtp");
const sendOtpEmail = require("./sendOtpEmail")

const otpstore = new Map();

const sendOtp = async (req,res)=>{
    const {email} = req.body;

    if(!email || !validator.isEmail(email)){
        return res.status(400).json({message:"Please provide a valid email"});
    }

    const otp = generateOtp();
    const expiresAt = Date.now()+5*60*1000;
    otpstore.set(email,{otp,expiresAt});

    const result = await sendOtpEmail(email,otp);

    if(result.success){
        res.status(200).json({message:"OTP sent to email"});
    }else{
        res.status(500).json({message:result.message});
    }
};


module.exports = {sendOtp,otpstore};