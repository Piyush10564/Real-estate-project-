const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false   // optional — OAuth users have no password
  },
  googleId:     { type: String, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  phone:        String,
  profileImage: String,
  userType: {
    type: String,
    enum: ['buyer', 'seller', 'agent'],
    default: 'buyer'
  },
  bio:      String,
  company:  String,
  location: String,
  verified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt:{ type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    // Lower rounds from 10 to 8 to reduce CPU time on low-resource hosts (small, deliberate tradeoff)
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) { next(error); }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
