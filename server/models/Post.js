const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    category: {
        type: String,
        enum: ['General', 'Backend Development', 'Frontend Development', 'Data Science', 'AI/ML', 'DevOps', 'Interview Experience'],
        default: 'General'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
