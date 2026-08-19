import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, User, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-md border-b border-agri-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-agri-600 p-2 rounded-lg">
                                <Sprout className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-agri-900">AgriSmart</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`${isActive('/') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                            Home
                        </Link>
                        {user && (
                            <>
                                <Link to="/dashboard" className={`${isActive('/dashboard') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                                    Dashboard
                                </Link>
                                <Link to="/analytics" className={`${isActive('/analytics') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                                    Analytics
                                </Link>
                                <Link to="/storage" className={`${isActive('/storage') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                                    Storage
                                </Link>
                                <Link to="/market" className={`${isActive('/market') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                                    Market Prices
                                </Link>
                                <Link to="/profile" className={`${isActive('/profile') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                                    Profile
                                </Link>
                            </>
                        )}
                        {!user && (
                            <Link to="/market" className={`${isActive('/market') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                                Market Prices
                            </Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-agri-600 transition-colors focus:outline-none"
                                >
                                    <User size={16} />
                                    <span>{user.name} ({user.role})</span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg py-2 border border-gray-100 divide-y divide-gray-100">
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
                                            {user.location && <p className="text-sm text-gray-500">📍 {user.location}</p>}
                                            {user.phone && <p className="text-sm text-gray-500">📱 {user.phone}</p>}
                                            {user.email && <p className="text-sm text-gray-500">✉️ {user.email}</p>}
                                        </div>
                                        <div className="px-4 py-2">
                                            <button
                                                onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                                                className="w-full text-left text-agri-600 hover:text-agri-700 text-sm font-medium flex items-center gap-2 py-1"
                                            >
                                                <UserCircle size={16} />
                                                View Profile
                                            </button>
                                        </div>
                                        <div className="px-4 py-2">
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    logout();
                                                    navigate('/login');
                                                }}
                                                className="w-full text-left text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2 py-1"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-agri-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-agri-600 text-white px-5 py-2.5 rounded-lg hover:bg-agri-700 transition-colors shadow-lg shadow-agri-600/30 transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-medium">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-agri-600 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
                    <Link to="/" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    {user && (
                        <>
                            <Link to="/dashboard" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            <Link to="/analytics" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Analytics</Link>
                            <Link to="/storage" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Storage</Link>
                            <Link to="/market" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Market Prices</Link>
                            <Link to="/profile" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                        </>
                    )}
                    {!user && (
                        <Link to="/market" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Market Prices</Link>
                    )}
                    <div className="pt-4 border-t border-gray-100">
                        {user ? (
                            <div className="flex flex-col space-y-3 pb-3 border-b border-gray-100 mb-3">
                                <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
                                    {user.location && <p className="text-sm text-gray-500 delay-100">Location: {user.location}</p>}
                                    {user.phone && <p className="text-sm text-gray-500">Phone: {user.phone}</p>}
                                    {user.email && <p className="text-sm text-gray-500">Email: {user.email}</p>}
                                </div>
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="w-full text-left text-red-600 font-medium flex items-center gap-2"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                <Link to="/login" className="text-center text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link to="/signup" className="text-center bg-agri-600 text-white px-5 py-2.5 rounded-lg hover:bg-agri-700 font-medium" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
