const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    currentCareer: {
        type: String,
    },
    targetCareer: {
        type: String,
    },
    skills: [String],
    isMentor: {
        type: Boolean,
        default: false
    },
    mentorProfile: {
        company: String,
        organization: String,
        experience: Number,
        primaryDomain: String,
        bio: String,
        linkedIn: String,
        portfolio: String,
        availability: String,
        expertRole: {
            type: String,
            enum: ['Career Consultant', 'Industry Professional', 'Domain Expert']
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
