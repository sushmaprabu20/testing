const courseRecommendations = require('../config/courseRecommendations');

const getRecommendations = async (req, res) => {
    try {
        const { missingSkills } = req.body;

        if (!missingSkills || !Array.isArray(missingSkills)) {
            return res.status(400).json({ message: 'Missing skills must be an array' });
        }

        if (missingSkills.length === 0) {
            return res.json({
                status: 'career-ready',
                message: 'You are career-ready!',
                courses: []
            });
        }

        let recommendedCourses = [];
        const seenCourses = new Set();
        const uncoveredSkills = [];

        // 1. First pass: Find actual course recommendations
        missingSkills.forEach(skill => {
            const normalizedSkill = skill.toLowerCase();
            const courses = courseRecommendations[normalizedSkill];

            if (courses && courses.length > 0) {
                courses.forEach(course => {
                    if (!seenCourses.has(course.link)) {
                        recommendedCourses.push({
                            ...course,
                            addressedSkill: skill
                        });
                        seenCourses.add(course.link);
                    }
                });
            } else {
                uncoveredSkills.push(skill);
            }
        });

        // 2. Second pass: Add fallbacks for uncovered skills
        uncoveredSkills.forEach(skill => {
            const encodedSkill = encodeURIComponent(skill);
            const fallbackCourse = {
                title: `Learn ${skill} (Search Results)`,
                platform: 'Udemy / Coursera',
                description: `Find top-rated courses to master ${skill} and bridge your skill gap.`,
                link: `https://www.udemy.com/courses/search/?q=${encodedSkill}`,
                thumbnail: 'https://images.unsplash.com/photo-1501504905953-f8c97f33e1f1?auto=format&fit=crop&q=80&w=480',
                addressedSkill: skill,
                isFallback: true
            };
            recommendedCourses.push(fallbackCourse);
        });

        // Limit to 10 courses instead of 5 to allow better coverage
        recommendedCourses = recommendedCourses.slice(0, 10);

        res.status(200).json({
            status: 'gap',
            courses: recommendedCourses
        });

    } catch (error) {
        console.error('Course recommendation error:', error);
        res.status(500).json({ message: 'Error fetching course recommendations' });
    }
};


module.exports = {
    getRecommendations
};
