const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  resetToken: String,
  resetTokenExpiration: Date,
  lastLogin: {
    type: Date,
    default: null
  }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
