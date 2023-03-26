const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }, 
   roles: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User',
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
