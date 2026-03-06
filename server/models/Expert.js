const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Career Consultant', 'Industry Professional', 'Domain Expert']
    },
    expertise: {
        type: [String],
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
    },
    availability: {
        type: [String],
        default: ['Monday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 4:00 PM']
    }
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
