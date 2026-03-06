const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Group = require('./models/Group');

dotenv.config({ path: path.join(__dirname, '.env') });

const groups = [
    {
        name: 'Backend Development',
        description: 'Discuss Node.js, Python, Java, Databases, and APIs.',
        icon: 'Server',
        domain: 'Backend Development'
    },
    {
        name: 'Frontend Development',
        description: 'React, Vue, CSS, and modern web interfaces.',
        icon: 'Layout',
        domain: 'Frontend Development'
    },
    {
        name: 'Data Science',
        description: 'Machine Learning, Data Analysis, and Python.',
        icon: 'Database',
        domain: 'Data Science'
    },
    {
        name: 'AI / ML',
        description: 'Explore neural networks and intelligent systems.',
        icon: 'Cpu',
        domain: 'AI/ML'
    },
    {
        name: 'DevOps & Cloud',
        description: 'AWS, Docker, Kubernetes, and CI/CD flow.',
        icon: 'Cloud',
        domain: 'DevOps'
    }
];

const seedGroups = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Group.deleteMany();
        console.log('Cleared existing groups');

        await Group.insertMany(groups);
        console.log('Seeded community groups');

        process.exit();
    } catch (error) {
        console.error('Error seeding groups:', error);
        process.exit(1);
    }
};

seedGroups();
