const Expert = require('../models/Expert');

exports.getAllExperts = async (req, res) => {
    try {
        const { domain, type, experience } = req.query;
        let query = {};

        if (domain) {
            query.expertise = { $in: [new RegExp(domain, 'i')] };
        }
        if (type) {
            query.role = type;
        }
        if (experience) {
            query.experience = { $gte: parseInt(experience) };
        }

        const experts = await Expert.find(query).sort({ experience: -1 });
        res.status(200).json(experts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching experts', error: error.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const { skills } = req.body; // Missing skills from analysis
        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({ message: 'Skills array is required' });
        }

        // Find experts who have expertise in the missing skills
        const experts = await Expert.find({
            expertise: { $in: skills.map(s => new RegExp(s, 'i')) }
        }).limit(3);

        res.status(200).json(experts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommended experts', error: error.message });
    }
};
