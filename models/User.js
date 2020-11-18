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
    eid: {
        type: String,
        unique: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    gender: {
        type: String,
    },
    jobTitle: {
        type: String, 
    },
    role: {
        type: String,
    },
    sameLevelCoach: {
        type: Boolean,
    },
    shadow: {
        type: Boolean,
    },
    anyLevelCoach: {
        type: Boolean,
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

module.exports = User = mongoose.model('user', UserSchema)