const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/emailService');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;
    
    console.log('Register request received:', { firstName, lastName, email, password: password ? '***' : 'missing', userType });
    
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Detailed validation
    const missingFields = [];
    if (!firstName || String(firstName).trim() === '') missingFields.push('firstName');
    if (!lastName || String(lastName).trim() === '') missingFields.push('lastName');
    if (!normalizedEmail || normalizedEmail === '') missingFields.push('email');
    if (!password || String(password).trim() === '') missingFields.push('password');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        message: 'Please fill all required fields',
        missingFields,
        receivedData: { firstName, lastName, email, userType }
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: password.trim(),
      userType: userType || 'buyer'
    });

    await user.save();

    // Send welcome email without blocking registration response
    sendWelcomeEmail(normalizedEmail, firstName)
      .then((welcomeResult) => {
        if (!welcomeResult.success) {
          console.warn(`Welcome email failed for ${normalizedEmail}: ${welcomeResult.error || 'Unknown error'}`);
        }
      })
      .catch((error) => {
        console.warn(`Welcome email failed for ${normalizedEmail}: ${error.message}`);
      });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log(`User registered successfully: ${normalizedEmail}`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation failed', details: messages });
    }
    res.status(500).json({ message: error.message, error: process.env.NODE_ENV === 'development' ? error.stack : undefined });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.status(200).json({ message: 'If an account exists with that email, we have sent a password reset link.' });
    }

    // Generate reset token using crypto
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token before saving (for security)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token expiration (1 hour from now)
    const tokenExpiration = new Date(Date.now() + 3600000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    // Send email with reset link
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Password reset link has been sent to your email. Please check your inbox.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ 
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
