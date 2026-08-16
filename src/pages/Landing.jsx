import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Truck, ShieldCheck, Sprout } from 'lucide-react';

export default function Landing() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-agri-900 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-58f21a406351?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Smart Supply Chain <br />
                            <span className="text-agri-400">For Modern Agriculture</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
                            Connect directly with buyers, minimize post-harvest losses, and optimize your profits with our AI-driven insights.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/signup" className="bg-agri-500 hover:bg-agri-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-agri-500/30">
                                Get Started
                            </Link>
                            <Link to="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/20">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-agri-100 rounded-xl flex items-center justify-center text-agri-600 mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Reduce Harvest Loss</h3>
                            <p className="text-gray-600">Track spoilage risks and get storage recommendations to keep your produce fresh.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Logistics</h3>
                            <p className="text-gray-600">Calculate exact transport costs and connect with reliable logistics partners.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Profit Optimization</h3>
                            <p className="text-gray-600">Get data-driven price recommendations to maximize your net profit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
