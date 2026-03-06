const Student = require('../models/Student');

exports.registerMentor = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const {
            fullName,
            currentRole,
            company,
            organization,
            experience,
            primaryDomain,
            bio,
            linkedIn,
            portfolio,
            availability,
            expertRole
        } = req.body;

        student.isMentor = true;
        student.mentorProfile = {
            company,
            organization,
            experience,
            primaryDomain,
            bio,
            linkedIn,
            portfolio,
            availability,
            expertRole
        };

        await student.save();
        res.status(200).json({ message: 'Mentor profile registered successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error registering mentor', error: error.message });
    }
};

exports.getRecommendedMentors = async (req, res) => {
    try {
        const { targetCareer, skillGaps } = req.body;

        let query = {
            isMentor: true,
            user: { $ne: req.user._id } // Don't recommend self
        };

        // Algorithm logic: 
        // 1. Match primary domain or target career
        // 2. Match skills (not implemented yet in this basic version, will add in future iteration)

        const mentors = await Student.find(query)
            .populate('user', 'name')
            .limit(5);

        // Simple scoring / filtering
        const filteredMentors = mentors.filter(m => {
            const domainMatch = m.mentorProfile?.primaryDomain?.toLowerCase() === targetCareer?.toLowerCase();
            const roleMatch = m.mentorProfile?.expertRole?.toLowerCase().includes('industry') ||
                m.mentorProfile?.expertRole?.toLowerCase().includes('domain');
            return domainMatch || roleMatch;
        });

        res.status(200).json(filteredMentors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommended mentors', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email');
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { currentCareer, targetCareer, skills, isMentor, mentorProfile } = req.body;
        const student = await Student.findOneAndUpdate(
            { user: req.user._id },
            { currentCareer, targetCareer, skills, isMentor, mentorProfile },
            { new: true }
        );
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await Student.find({ isMentor: true })
            .populate('user', 'name')
            .limit(10);
        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentors', error: error.message });
    }
};
