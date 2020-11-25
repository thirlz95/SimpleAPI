const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: {
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

module.exports = Projects = mongoose.model('projects', ProjectSchema);
