require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    console.log('Testing Email with Nodemailer...\n');

    // For development, use Ethereal
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using Ethereal email service for testing...\n');

      // Create a test account at ethereal.email
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      console.log('Ethereal Email Account Created:');
      console.log('User:', testAccount.user);
      console.log('Pass:', testAccount.pass);
      console.log('Web:', 'https://ethereal.email\n');

      console.log('Verifying connection...');
      const verified = await transporter.verify();

      if (verified) {
        console.log('✅ Connection successful!\n');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
          from: 'test@example.com',
          to: testAccount.user,
          subject: 'Test Email - Aggarwal Properties',
          html: '<h1>✅ Email Test Successful!</h1><p>Your email setup with Nodemailer is working perfectly!</p>'
        });

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    } else {
      // Production Gmail setup
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

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. For Gmail: Verify PASSWORD is WITHOUT spaces');
    console.log('2. Check 2-Factor is enabled: https://myaccount.google.com/security');
    console.log('3. Generate new app password: https://myaccount.google.com/apppasswords');
    console.log('4. For Ethereal: Check your internet connection');
  }
}

testEmail();
