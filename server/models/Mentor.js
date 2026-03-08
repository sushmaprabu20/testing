const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentRole: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    primaryDomain: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    linkedIn: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    expertRole: {
        type: String,
        enum: ['Career Consultant', 'Industry Professional', 'Domain Expert'],
        default: 'Industry Professional'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mentor', mentorSchema);
