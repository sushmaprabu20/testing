const Student = require('../models/Student');
const Mentor = require('../models/Mentor');


exports.registerMentor = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const {
            currentRole,
            company,
            experience,
            primaryDomain,
            bio,
            linkedIn,
            availability,
            expertRole
        } = req.body;

        // 1. Update Student Profile
        student.isMentor = true;
        student.mentorProfile = {
            company,
            experience,
            primaryDomain,
            bio,
            linkedIn,
            availability,
            expertRole
        };
        await student.save();

        // 2. Create or Update Mentor Record
        let mentor = await Mentor.findOne({ user: req.user._id });
        if (mentor) {
            mentor.currentRole = currentRole;
            mentor.company = company;
            mentor.experience = experience;
            mentor.primaryDomain = primaryDomain;
            mentor.bio = bio;
            mentor.linkedIn = linkedIn;
            mentor.availability = availability;
            mentor.expertRole = expertRole;
            await mentor.save();
        } else {
            mentor = await Mentor.create({
                user: req.user._id,
                currentRole,
                company,
                experience,
                primaryDomain,
                bio,
                linkedIn,
                availability,
                expertRole
            });
        }

        res.status(200).json({
            message: 'Mentor profile registered successfully',
            student,
            mentor
        });
    } catch (error) {
        console.error('Error registering mentor:', error);
        res.status(500).json({ message: 'Error registering mentor', error: error.message });
    }
};


exports.getRecommendedMentors = async (req, res) => {
    try {
        const { targetCareer } = req.body;

        const query = {
            user: { $ne: req.user._id } // Don't recommend self
        };

        const mentors = await Mentor.find(query)
            .populate('user', 'name')
            .limit(10);

        // Simple filtering based on targetCareer
        const filteredMentors = mentors.filter(m => {
            const domainMatch = m.primaryDomain?.toLowerCase() === targetCareer?.toLowerCase();
            const roleMatch = m.expertRole?.toLowerCase().includes('industry') ||
                m.expertRole?.toLowerCase().includes('domain');
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
        const mentors = await Mentor.find({})
            .populate('user', 'name')
            .limit(20);
        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentors', error: error.message });
    }
};


exports.deleteProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ message: 'Profile not found' });

        await student.deleteOne();
        res.status(200).json({ message: 'Career profile deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
};
