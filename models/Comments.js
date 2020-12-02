const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  name: {
    type: String
  },
  comment: {
    type: String
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Comments = mongoose.model('comments', CommentSchema);
