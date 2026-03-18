# 📧 Email Configuration Guide for Real Estate App

## Overview
The forgot password feature now sends actual emails to users with password reset links. Follow this guide to set up email functionality using Gmail.

## Setup Instructions

### Step 1: Enable 2-Factor Authentication in Gmail
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security)
2. Click on **"2-Step Verification"** on the left sidebar
3. Follow the steps to enable 2-factor authentication with your phone

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** from the "Select the app" dropdown
3. Select **Windows PC** (or your device type)
4. Google will generate a 16-character app password
5. Copy this password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 3: Update .env File
Edit the `backend/.env` file and add/update these variables:

```env
# Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password_without_spaces
EMAIL_FROM=noreply@realestate.com
FRONTEND_URL=http://localhost:3000
```

**Example:**
```env
EMAIL_USER=john@gmail.com
EMAIL_PASSWORD=abcdwxyzlmnopqrst
EMAIL_FROM=noreply@realestate.com
FRONTEND_URL=http://localhost:3000
```

### Step 4: Verify Backend Dependencies
Ensure nodemailer is installed:
```bash
cd backend
npm install nodemailer
```

### Step 5: Restart the Backend Server
```bash
cd backend
npm run dev
```

## Testing the Feature

### Test Steps:
1. Go to the **Login** page
2. Click **"Forgot Password?"** link
3. Enter your test email address (use your own or any email)
4. You should receive an email with a password reset link
5. Click the link in the email to reset your password
6. Enter your new password and confirm
7. Login with your new password

### Troubleshooting

#### ❌ "Failed to send reset email"
**Solution:** Check your `.env` file:
- Verify `EMAIL_USER` is correct
- Verify `EMAIL_PASSWORD` is the 16-character app password (without spaces)
- Make sure you enabled 2-Factor authentication in Gmail

#### ❌ Email not arriving
**Solution:**
1. Check your spam/junk folder
2. Make sure 2-Factor Authentication is enabled on Gmail
3. Verify the app password is correct
4. Check backend console for error messages

#### ❌ "Invalid credentials" error
**Solution:**
- The app password might be incorrect
- Re-generate a new app password from [App Passwords](https://myaccount.google.com/apppasswords)
- Make sure there are no extra spaces in the password

### For Production

When deploying to production:

1. **Use Email Service:** Switch from Gmail to a professional email service:
   - SendGrid
   - Mailgun
   - AWS SES
   - Postmark

2. **Environment Variables:** Use strong, unique credentials
3. **Frontend URL:** Update `FRONTEND_URL` to your production domain
4. **Email Template:** The email template is professional and includes branding

### Alternative: Using Gmail with App Password

For small-scale production, Gmail is acceptable but has limitations:
- **Rate Limit:** 500 emails per day
- **Daily Limit:** May be throttled after multiple requests
- **Recommended for:** Development and testing only

## Security Best Practices ✅

- ✅ Reset tokens are hashed before storage
- ✅ Tokens expire after 1 hour
- ✅ Email addresses are not exposed (security pattern)
- ✅ Passwords are hashed with bcryptjs
- ✅ Never log sensitive data
- ✅ Use environment variables for credentials

## Email Template Features

The password reset email includes:
- Professional dark theme design (matching your app)
- Clear call-to-action button
- Direct reset link
- Token expiration information
- Support information

## FAQ

**Q: Can I use a different email provider?**
A: Yes! Update the `nodemailer` transporter configuration in `backend/utils/emailService.js`

**Q: Is the email service working if I don't see errors?**
A: Check your email inbox (and spam folder). The backend will respond with "Password reset link has been sent" even if disabled in development.

**Q: How do I reset a user's password if they're locked out?**
A: Users can always use the "Forgot Password" feature to reset their password via email.

## Support
If you encounter issues, check:
1. Backend console logs
2. Email trash/spam folder
3. Gmail account security settings
4. Environment variables in `.env`
