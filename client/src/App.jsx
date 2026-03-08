import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Community from './pages/Community';
import Dashboard from './components/Dashboard/Dashboard';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function AppContent() {
    const location = useLocation();

    return (
        <div className="app">
            <Navbar />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                    <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                    <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
                    <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                    <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                    <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <PageWrapper><Dashboard /></PageWrapper>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <PageWrapper><UserProfile /></PageWrapper>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}


export default App;
