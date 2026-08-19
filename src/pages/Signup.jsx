import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Signup() {
    const [role, setRole] = useState('farmer');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const extraData = role === 'farmer'
                ? { location, phone }
                : { location, email };
            login(role, name || (role === 'farmer' ? 'New Farmer' : 'New Buyer'), extraData);
            setLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-agri-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row-reverse">

                {/* Right Side - Image/Branding */}
                <div className="hidden md:flex md:w-1/2 bg-agri-800 text-white p-12 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Join the Network</h2>
                        <p className="text-agri-200 text-lg">Reduce losses, increase profits, and access better markets today.</p>
                    </div>
                    <div className="relative z-10">
                        <div className="flex -space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full border-2 border-agri-800 bg-gray-200"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-agri-800 bg-gray-300"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-agri-800 bg-gray-400"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-agri-800 bg-agri-600 flex items-center justify-center text-xs font-bold">+2k</div>
                        </div>
                        <p className="text-sm text-agri-300">Join 2,000+ farmers optimizing their harvest.</p>
                    </div>
                    {/* Abstract circles */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-agri-700/30 rounded-full blur-3xl"></div>
                </div>

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
                        <p className="text-gray-500 mt-2">Start your journey with us</p>
                    </div>

                    <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
                        <button
                            onClick={() => setRole('farmer')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${role === 'farmer' ? 'bg-white text-agri-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Tractor size={18} />
                            Farmer
                        </button>
                        <button
                            onClick={() => setRole('buyer')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${role === 'buyer' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ShoppingBag size={18} />
                            Buyer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder={role === 'farmer' ? "Ramesh Kumar" : "John Doe"}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="e.g. Madurai, Tamil Nadu"
                            />
                        </div>

                        {role === 'farmer' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    pattern="[6-9][0-9]{9}"
                                    title="Please enter a valid 10-digit Indian phone number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder="9876543210"
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="buyer@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="Create a strong password"
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-agri-600 hover:bg-agri-700 shadow-agri-600/30 hover:shadow-agri-600/40'
                                }`}
                        >
                            {loading ? (
                                <span>Creating Account...</span>
                            ) : (
                                <>
                                    Sign Up <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-agri-600 font-semibold hover:text-agri-700">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
