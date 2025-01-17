import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, currentUser } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(currentUser?.role)) {
        return <Navigate to={`/${currentUser?.role}/dashboard`} replace />;
    }

    return children;
};

export default ProtectedRoute; 