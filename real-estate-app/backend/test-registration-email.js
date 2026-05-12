require('dotenv').config();
const { sendWelcomeEmail } = require('./utils/emailService');

async function testWelcomeEmail() {
  try {
    console.log('Testing Welcome Email during registration...\n');
    
    const testEmail = 'test.nodemailer.2024@gmail.com';
    const testName = 'Test User';
    
    console.log(`Sending welcome email to: ${testEmail}`);
    console.log(`User name: ${testName}\n`);
    
    const result = await sendWelcomeEmail(testEmail, testName);
    
    if (result.success) {
      console.log('✅ Welcome email sent successfully!');
      console.log('Email configuration is working!');
    } else {
      console.log('❌ Failed to send welcome email');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

testWelcomeEmail();
