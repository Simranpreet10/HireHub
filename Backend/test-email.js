require('dotenv').config();
const sendOtpEmail = require('./services/sendOtpEmail');

async function testEmail() {
  console.log('Testing email with configuration:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
  
  try {
    const result = await sendOtpEmail('sumit874.be22@chitkara.edu.in', '123456');
    console.log('Email test result:', result);
  } catch (error) {
    console.error('Email test error:', error);
  }
}

testEmail();
