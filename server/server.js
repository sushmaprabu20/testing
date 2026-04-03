const express = require('express');
const dotenv = require('dotenv');

// Load environment variables immediately
dotenv.config();

const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const courseRoutes = require('./routes/courseRoutes');


console.log('Starting server...');
console.log('Env loaded');


connectDB().then(() => {
    console.log('[SERVER] Database connected successfully');
    console.log(`[SERVER] Using Database: ${mongoose.connection.name}`);
    console.log(`[SERVER] Collections: ${Object.keys(mongoose.connection.collections).join(', ')}`);
}).catch(err => {
    console.error('[SERVER] Database connection failed:', err);
});

const app = express();
console.log('Express app initialized');

const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Use regex to handle all preflight routes in Express 5
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`[INCOMING] ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/resume', resumeRoutes);

app.use('/api/courses', courseRoutes);
app.use('/api/mentors', require('./routes/mentorRoutes'));

app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
console.log('Routes mounted');

app.get('/api/diag', (req, res) => {
    res.json({
        status: 'ok',
        env: process.env.NODE_ENV,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.get('/', (req, res) => {

    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
