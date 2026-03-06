const mongoose = require('mongoose');
const Expert = require('./models/Expert');
require('dotenv').config();

const experts = [
    {
        name: 'Alex Rivera',
        role: 'Industry Professional',
        expertise: ['Node.js', 'Express', 'MongoDB', 'Backend Developer'],
        experience: 8,
        description: 'Senior Backend Architect at TechFlow. Expert in scalable microservices and cloud infrastructure.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        name: 'Sarah Chen',
        role: 'Domain Expert',
        expertise: ['Python', 'Data Science', 'Machine Learning', 'AI'],
        experience: 6,
        description: 'ML Engineer specializing in natural language processing and predictive analytics.',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        name: 'David Miller',
        role: 'Career Consultant',
        expertise: ['Career Planning', 'Resume Building', 'Interview Prep'],
        experience: 12,
        description: 'Helping professionals pivot into tech for over a decade. Focus on strategic career transitions.',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        name: 'Priya Sharma',
        role: 'Industry Professional',
        expertise: ['React', 'JavaScript', 'Frontend Developer', 'UI/UX'],
        experience: 5,
        description: 'Frontend Lead at Creative Minds. Passionate about building intuitive and accessible user interfaces.',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        name: 'James Wilson',
        role: 'Domain Expert',
        expertise: ['Git', 'Docker', 'Kubernetes', 'DevOps'],
        experience: 10,
        description: 'DevOps specialist focused on CI/CD pipelines and infrastructure as code.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
    }
];

const seedExperts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-mapping');
        console.log('Connected to MongoDB for seeding experts...');

        await Expert.deleteMany({});
        console.log('Cleared existing experts.');

        await Expert.insertMany(experts);
        console.log('Successfully seeded experts!');

        process.exit();
    } catch (error) {
        console.error('Error seeding experts:', error);
        process.exit(1);
    }
};

seedExperts();
