import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Props:
 *   allowedRole  — optional, 'farmer' | 'buyer'
 *                  If omitted, any authenticated user is allowed.
 *
 * Behaviour:
 *   • Not authenticated          → /login  (preserving intended destination)
 *   • Wrong role (farmer→buyer)  → /buyer-dashboard
 *   • Wrong role (buyer→farmer)  → /dashboard
 *   • Correct role               → render children
 */
export default function ProtectedRoute({ children, allowedRole }) {
    const { user } = useAuth();
    const location = useLocation();

    // Not logged in at all → go to login, remember where they wanted to go
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Wrong role checks
    if (allowedRole === 'farmer' && user.role !== 'farmer') {
        // A buyer trying to access a farmer-only page
        return <Navigate to="/buyer-dashboard" replace />;
    }
    if (allowedRole === 'buyer' && user.role !== 'buyer') {
        // A farmer trying to access a buyer-only page
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
