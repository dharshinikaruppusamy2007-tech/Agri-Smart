import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Login() {
    const [role, setRole] = useState('farmer'); // 'farmer' or 'buyer'
    const { login } = useAuth();
    const navigate = useNavigate();

    // State for different login methods
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSendOtp = () => {
        if (!mobile) return;
        setLoading(true);
        // Simulate sending OTP
        setTimeout(() => {
            setOtpSent(true);
            setLoading(false);
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const userType = role === 'farmer' ? 'Ramesh Kumar' : 'Big Basket Ltd';

            const extraData = role === 'farmer'
                ? { location: 'Madurai, Tamil Nadu', phone: mobile }
                : { location: 'Chennai, Tamil Nadu', email: email };

            login(role, userType, extraData);
            setLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[600px]">

                {/* Left Side - Solid Green Background & Text */}
                <div className="hidden md:flex md:w-1/2 bg-agri-600 text-white p-12 flex-col justify-center items-start relative">
                    <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                    <p className="text-agri-100 text-lg leading-relaxed">
                        Manage your harvest, track profits, and connect with buyers seamlessly.
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">Login to Account</h3>
                        <p className="text-gray-500 mt-2">Access your dashboard</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                        <button
                            onClick={() => { setRole('farmer'); setOtpSent(false); }}
                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${role === 'farmer' ? 'bg-white text-agri-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Tractor size={20} />
                            Farmer
                        </button>
                        <button
                            onClick={() => setRole('buyer')}
                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${role === 'buyer' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ShoppingBag size={20} />
                            Buyer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {role === 'farmer' ? (
                            // Farmer Flow: Mobile + OTP
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        disabled={otpSent}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                {otpSent ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                        <input
                                            type="text"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="123456"
                                        />
                                    </div>
                                ) : null}

                                {otpSent ? (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-agri-600 hover:bg-agri-700 shadow-agri-600/30 hover:shadow-agri-600/40'
                                            }`}
                                    >
                                        {loading ? 'Verifying...' : <>Verify & Login <ArrowRight size={20} /></>}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={loading || !mobile}
                                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${loading || !mobile ? 'bg-gray-400 cursor-not-allowed' : 'bg-agri-600 hover:bg-agri-700 shadow-agri-600/30 hover:shadow-agri-600/40'
                                            }`}
                                    >
                                        {loading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                )}
                            </>
                        ) : (
                            // Buyer Flow: Email + Password
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                        <input type="checkbox" className="rounded text-agri-600 focus:ring-agri-500" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-agri-600 hover:text-agri-700 font-medium">Forgot Password?</a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-agri-600 hover:bg-agri-700 shadow-agri-600/30 hover:shadow-agri-600/40'
                                        }`}
                                >
                                    {loading ? (
                                        <span>Logging in...</span>
                                    ) : (
                                        <>
                                            Login <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </form>

                    <p className="mt-8 text-center text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-agri-600 font-semibold hover:text-agri-700">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

