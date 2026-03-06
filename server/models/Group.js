const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    icon: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    domain: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);
