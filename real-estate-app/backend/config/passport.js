const passport   = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const FRONTEND   = process.env.FRONTEND_URL || 'http://localhost:3000';

// ── Serialize / Deserialize ──────────────────
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await User.findById(id)); }
  catch (e) { done(e); }
});

// ── Google Strategy ──────────────────────────
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID     || 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL:  'http://localhost:5000/api/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists by googleId
    let user = await User.findOne({ googleId: profile.id });
    if (user) return done(null, user);

    // Check by email (might have registered with password before)
    user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      user.googleId     = profile.id;
      user.authProvider = 'google';
      if (!user.profileImage && profile.photos[0])
        user.profileImage = profile.photos[0].value;
      await user.save();
      return done(null, user);
    }

    // Create brand-new user
    user = await User.create({
      firstName:    profile.name.givenName  || 'User',
      lastName:     profile.name.familyName || '',
      email:        profile.emails[0].value,
      profileImage: profile.photos[0]?.value || '',
      googleId:     profile.id,
      authProvider: 'google',
      verified:     true,
    });
    done(null, user);
  } catch (e) { done(e); }
}));

// ── Helper: mint JWT ─────────────────────────
function mintToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { passport, mintToken, FRONTEND };
