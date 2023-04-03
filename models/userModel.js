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
  authenticationType: {
    form: {
      password: String
    },
    google: {
      uuid: String
    }
  }, 
   roles: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  newsletterSub:{
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String,
  }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
