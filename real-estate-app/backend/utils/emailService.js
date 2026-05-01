const nodemailer = require('nodemailer');

// Create Ethereal test account for development
let etherealTransporter = null;

const createEtherealTransporter = async () => {
  if (etherealTransporter) return etherealTransporter;

  try {
    // Create a test account at ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    etherealTransporter = nodemailer.createTransport({
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
    console.log('Web:', 'https://ethereal.email');

    return etherealTransporter;
  } catch (error) {
    console.error('Failed to create Ethereal account:', error);
    throw error;
  }
};

// Create a console logger transporter for development
const mockTransporter = {
  sendMail: async (options) => {
    console.log('\n' + '='.repeat(60));
    console.log('📧 EMAIL NOTIFICATION (MOCK)');
    console.log('='.repeat(60));
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('From:', options.from);
    console.log('='.repeat(60) + '\n');
    return { messageId: 'mock-' + Date.now() };
  },
  verify: async () => {
    return true;
  }
};

let cachedTransporter = null;

const getEmailPassword = () => {
  // Gmail app passwords are sometimes copied with spaces; normalize it.
  return (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, '').trim();
};

const getSenderEmail = () => {
  const from = (process.env.EMAIL_FROM || '').trim();
  if (!from || from.includes('your_email@gmail.com')) {
    return process.env.EMAIL_USER;
  }
  return from;
};

const hasEmailConfig = () => {
  return Boolean(process.env.EMAIL_USER && getEmailPassword());
};

// Get transporter
const getTransporter = async () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // If email config is available, use Gmail (even in development)
  if (hasEmailConfig()) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: getEmailPassword(),
      },
    });

    await transporter.verify();
    console.log('Gmail transporter is ready.');
    cachedTransporter = transporter;
    return cachedTransporter;
  }

  // Fallback to Ethereal for development
  console.log('Using Ethereal email service for development...');
  cachedTransporter = await createEtherealTransporter();
  return cachedTransporter;
  return cachedTransporter;
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const mailTransporter = await getTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: getSenderEmail(),
      to: email,
      subject: 'Password Reset Request - Aggarwal Properties',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
          </div>

          <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">Hello,</p>
            
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset the password for your Aggarwal Properties account. If you did not make this request, you can ignore this email.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>

            <p style="color: #999; font-size: 13px; margin-top: 20px;">
              Or copy and paste this link in your browser:
            </p>
            <p style="color: #667eea; font-size: 12px; word-break: break-all; margin: 10px 0;">
              ${resetUrl}
            </p>

            <p style="color: #999; font-size: 13px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support.
            </p>

            <p style="color: #999; font-size: 13px; margin: 20px 0 0 0;">
              Best regards,<br/>
              <strong>Aggarwal Properties Team</strong>
            </p>
          </div>
        </div>
      `
    };

    const info = await mailTransporter.sendMail(mailOptions);
    
    // Log preview URL for Ethereal emails
    if (process.env.NODE_ENV !== 'production' && info.messageId && nodemailer.getTestMessageUrl) {
      console.log('📧 Password reset email sent!');
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const mailTransporter = await getTransporter();
    const mailOptions = {
      from: getSenderEmail(),
      to: email,
      subject: 'Welcome to Aggarwal Properties! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 32px;">Welcome to Aggarwal Properties</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #b8860b;">Your trusted real estate partner</p>
          </div>

          <div style="background: #f5f5f5; padding: 40px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">Hello ${firstName},</p>
            
            <p style="color: #666; line-height: 1.8; font-size: 15px;">
              🙏 Thank you for registering with <strong>Aggarwal Properties</strong>! We're thrilled to have you join our community of real estate enthusiasts.
            </p>

            <p style="color: #666; line-height: 1.8; font-size: 15px;">
              With your account, you can:
            </p>

            <ul style="color: #666; line-height: 1.8; font-size: 15px; margin: 15px 0;">
              <li>✓ Browse premium property listings</li>
              <li>✓ Save your favorite properties</li>
              <li>✓ Send inquiries to property owners</li>
              <li>✓ Manage your profile and preferences</li>
              <li>✓ Get updates on new listings matching your interests</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Explore Properties
              </a>
            </div>

            <p style="color: #666; line-height: 1.8; font-size: 15px;">
              If you have any questions or need assistance, our support team is always here to help. Feel free to reach out!
            </p>

            <div style="background: #fff9e6; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #b8860b;">
              <p style="color: #333; font-weight: bold; margin: 0 0 10px 0;">💡 Pro Tip:</p>
              <p style="color: #666; margin: 0; font-size: 14px;">Complete your profile with a photo and bio to get better responses from property owners and agents!</p>
            </div>

            <p style="color: #999; font-size: 13px; margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #ddd;">
              Best regards,<br/>
              <strong style="color: #333;">The Aggarwal Properties Team</strong><br/>
              <span style="font-size: 12px; color: #999;">Connecting People with Properties</span>
            </p>
          </div>

          <div style="background: #0f0f0f; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 10px 0;">© 2024 Aggarwal Properties. All rights reserved.</p>
            <p style="margin: 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #667eea; text-decoration: none;">Visit Our Website</a> | 
              <a href="mailto:support@aggarwalproperties.com" style="color: #667eea; text-decoration: none;">Contact Us</a>
            </p>
          </div>
        </div>
      `
    };

    const info = await mailTransporter.sendMail(mailOptions);
    
    // Log preview URL for Ethereal emails
    if (process.env.NODE_ENV !== 'production' && info.messageId && nodemailer.getTestMessageUrl) {
      console.log('📧 Welcome email sent!');
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } else {
      console.log(`Welcome email sent to ${email}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  getTransporter
};
