import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Market from './pages/Market';
import Profile from './pages/Profile';
import StorageManagement from './pages/StorageManagement';
import Transportation from './pages/Transportation';
import BuyerDashboard from './pages/BuyerDashboard';
import Marketplace from './pages/Marketplace';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/market" element={<Market />} />

            {/* Protected farmer-only routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRole="farmer"><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRole="farmer"><Analytics /></ProtectedRoute>} />
            <Route path="/storage" element={<ProtectedRoute allowedRole="farmer"><StorageManagement /></ProtectedRoute>} />
            <Route path="/transportation" element={<ProtectedRoute allowedRole="farmer"><Transportation /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRole="farmer"><Profile /></ProtectedRoute>} />

            {/* Protected buyer-only routes */}
            <Route path="/buyer-dashboard" element={<ProtectedRoute allowedRole="buyer"><BuyerDashboard /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute allowedRole="buyer"><Marketplace /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
