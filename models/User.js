const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true, // Trim spaces around the username
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Ensure the email is stored in lowercase
    trim: true, // Trim spaces around the email
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  // Ensure we only hash the password when it is being modified (or created)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10); // You can use any rounds here (10 is commonly used)
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware (for proper error handling)
  }
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

module.exports = mongoose.model('User', userSchema);
