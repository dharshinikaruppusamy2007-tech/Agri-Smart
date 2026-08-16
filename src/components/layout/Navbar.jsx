import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
                            </>
                        )}
                        <Link to="/market" className={`${isActive('/market') ? 'text-agri-600 font-medium' : 'text-gray-600 hover:text-agri-600'} transition-colors`}>
                            Market Prices
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User size={16} />
                                    {user.name} ({user.role})
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
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
                        </>
                    )}
                    <Link to="/market" className="block text-gray-600 hover:text-agri-600 font-medium" onClick={() => setIsMenuOpen(false)}>Market Prices</Link>
                    <div className="pt-4 border-t border-gray-100">
                        {user ? (
                            <button
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="w-full text-left text-red-600 font-medium"
                            >
                                Logout
                            </button>
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
