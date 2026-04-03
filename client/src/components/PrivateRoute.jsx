import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    console.log('[PRIVATE ROUTE] Auth State - User:', user, 'Loading:', loading);

    if (loading) return null; // Or a spinner

    if (!user) {
        console.warn('[PRIVATE ROUTE] No user found. Redirecting to login!');
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
