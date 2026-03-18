require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmail() {
  try {
    console.log('Testing Gmail with Nodemailer...\n');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***hidden***' : 'NOT SET');
    const appPassword = (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, '').trim();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: appPassword
      }
    });

    console.log('\nVerifying connection...');
    const verified = await transporter.verify();
    
    if (verified) {
      console.log('✅ Connection successful!\n');
      
      console.log('Sending test email...');
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Test Email - Aggarwal Properties',
        html: '<h1>✅ Email Test Successful!</h1><p>Your Gmail setup with Nodemailer is working perfectly!</p>'
      });
      
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('\n📧 Check your Gmail inbox for the test email!');
    } else {
      console.log('❌ Connection verification failed!');
      console.log('Possible issues:');
      console.log('1. EMAIL_PASSWORD is incorrect');
      console.log('2. PASSWORD HAS SPACES (remove all spaces!)');
      console.log('3. 2-Factor Authentication not enabled');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Verify PASSWORD is WITHOUT spaces');
    console.error('2. Check 2-Factor is enabled: https://myaccount.google.com/security');
    console.error('3. Generate new app password: https://myaccount.google.com/apppasswords');
  }
}

testGmail();
