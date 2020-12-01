const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  bio: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model('user', UserSchema);
