import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

import FarmerDashboard from '../components/dashboard/FarmerDashboard';
import BuyerDashboard from '../components/dashboard/BuyerDashboard';

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {user.role === 'farmer' ? 'Farmer Dashboard' : 'Buyer Dashboard'}
                </h1>

                {/* Render Dashboard based on Role */}
                {user.role === 'farmer' ? (
                    <FarmerDashboard />
                ) : (
                    <BuyerDashboard />
                )}
            </div>
        </div>
    );
}
