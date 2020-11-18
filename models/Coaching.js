const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
  },
  skills: {
    type: Array,
  },
  gender: {
    type: String,
  },
  bio: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
});
module.exports = User = mongoose.model('coach', UserSchema)