import React from 'react';
import {
    ShoppingBag, Store, TrendingUp, Package,
    Clock, CheckCircle2, ArrowRight, MapPin,
    ChevronRight, BarChart2, UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

/* ── tiny stat card ─────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, accent = 'agri', isComingSoon = false }) {
    const palettes = {
        agri: 'border-agri-400   bg-agri-50   text-agri-800',
        blue: 'border-blue-400   bg-blue-50   text-blue-800',
        orange: 'border-orange-400 bg-orange-50 text-orange-800',
        gray: 'border-gray-300   bg-gray-50   text-gray-700',
    };
    const iconPalettes = {
        agri: 'bg-agri-100   text-agri-600',
        blue: 'bg-blue-100   text-blue-600',
        orange: 'bg-orange-100 text-orange-600',
        gray: 'bg-gray-100   text-gray-500',
    };
    return (
        <div className={`rounded-xl border-l-4 p-5 shadow-sm ${palettes[accent]}`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${iconPalettes[accent]}`}>
                    <Icon size={20} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-0.5">{label}</p>
                    {isComingSoon ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-agri-200 text-agri-800 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-agri-500 animate-pulse" />
                            Coming Soon
                        </span>
                    ) : (
                        <p className="text-2xl font-bold leading-tight">{value}</p>
                    )}
                    {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
                </div>
            </div>
        </div>
    );
}

/* ── quick action button ─────────────────────────── */
function QuickAction({ icon: Icon, label, description, to, accent = 'agri' }) {
    const bg = { agri: 'bg-agri-50 hover:bg-agri-100 border-agri-200', blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200' };
    const text = { agri: 'text-agri-700', blue: 'text-blue-700' };
    const iconBg = { agri: 'bg-agri-100 text-agri-600', blue: 'bg-blue-100 text-blue-600' };
    return (
        <Link
            to={to}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${bg[accent]}`}
        >
            <div className={`p-2.5 rounded-lg shrink-0 ${iconBg[accent]}`}>
                <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
                <p className={`font-semibold text-sm ${text[accent]}`}>{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0" />
        </Link>
    );
}

/* ══════════════ BUYER DASHBOARD ══════════════ */
export default function BuyerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const buyerName = user?.name || 'Buyer';

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Page header ── */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-agri-600 p-2.5 rounded-xl">
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-[52px]">
                        Welcome, <span className="font-semibold text-agri-700">{buyerName}</span> — your sourcing hub for fresh farm produce.
                    </p>
                </div>

                {/* ── Welcome hero banner ── */}
                <div className="bg-agri-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                    {/* decorative blobs */}
                    <div className="absolute -top-10 -right-10 w-52 h-52 bg-agri-500 rounded-full opacity-30 pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-agri-700 rounded-full opacity-30 pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <p className="text-agri-200 text-sm font-medium uppercase tracking-wider mb-2">Buyer Account</p>
                            <h2 className="text-3xl font-bold mb-2">Welcome, {buyerName}!</h2>
                            <p className="text-agri-100 text-sm leading-relaxed max-w-lg">
                                Source fresh produce directly from verified local farmers.
                                Browse available crops, compare prices and place purchase requests — all in one place.
                            </p>
                            {user?.email && (
                                <p className="text-agri-300 text-xs mt-3">✉️ {user.email}</p>
                            )}
                            {user?.location && (
                                <p className="text-agri-300 text-xs mt-1">📍 {user.location}</p>
                            )}
                        </div>
                        <div className="shrink-0">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center min-w-[140px]">
                                <ShoppingBag size={32} className="mx-auto text-agri-200 mb-2" />
                                <p className="text-white font-bold text-sm">Buyer</p>
                                <p className="text-agri-200 text-xs mt-0.5">AgriSmart</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    <StatCard
                        icon={Store}
                        label="Available Crops"
                        isComingSoon
                        sub="Marketplace opens in Phase 3"
                        accent="agri"
                    />
                    <StatCard
                        icon={Package}
                        label="Active Requests"
                        value="0"
                        sub="No pending requests"
                        accent="blue"
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending Deliveries"
                        value="0"
                        sub="No deliveries in progress"
                        accent="orange"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Completed Purchases"
                        value="0"
                        sub="No purchase history yet"
                        accent="gray"
                    />
                </div>

                {/* ── Two-column main area ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">

                    {/* Marketplace coming-soon — wider column */}
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                        {/* Icon */}
                        <div className="w-24 h-24 bg-agri-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-agri-50">
                            <Store size={40} className="text-agri-400" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Fresh Crops From Local Farmers
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
                            Browse available crops and connect directly with farmers.
                            Fresh produce from verified farmers will appear here.
                        </p>

                        {/* Phase badge */}
                        <div className="inline-flex items-center gap-2 bg-agri-50 border border-agri-200 text-agri-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                            <span className="w-2 h-2 rounded-full bg-agri-500 animate-pulse" />
                            Marketplace Coming Soon — Phase 3
                        </div>

                        {/* CTA button */}
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="inline-flex items-center gap-2 bg-agri-600 hover:bg-agri-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-agri-600/25 hover:shadow-agri-600/40 active:scale-95"
                        >
                            <TrendingUp size={16} />
                            Explore Marketplace
                            <ArrowRight size={16} />
                        </button>
                        <p className="text-xs text-gray-400 mt-3">
                            Meanwhile, check current market prices →
                        </p>
                    </div>

                    {/* Quick Actions — narrower column */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Quick Actions card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <QuickAction
                                    icon={BarChart2}
                                    label="Explore Market Prices"
                                    description="Check latest crop prices"
                                    to="/market"
                                    accent="agri"
                                />
                                <QuickAction
                                    icon={UserCircle}
                                    label="View Profile"
                                    description="Manage your account info"
                                    to="/buyer-profile"
                                    accent="blue"
                                />
                            </div>
                        </div>

                        {/* Market Prices preview card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-agri-100 rounded-lg">
                                    <TrendingUp size={18} className="text-agri-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-800">Market Prices</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                Check the latest available crop prices from markets across India.
                            </p>
                            <Link
                                to="/market"
                                className="flex items-center justify-center gap-2 w-full border-2 border-agri-500 text-agri-700 hover:bg-agri-50 py-2.5 rounded-xl font-bold text-sm transition-colors"
                            >
                                <BarChart2 size={16} />
                                View Market Prices
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Account strip ── */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-agri-100 flex items-center justify-center shrink-0">
                                <ShoppingBag size={20} className="text-agri-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{buyerName}</p>
                                {user?.email && <p className="text-xs text-gray-500">{user.email}</p>}
                                {user?.location && <p className="text-xs text-gray-500">📍 {user.location}</p>}
                                <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full capitalize">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 sm:text-right">
                            Logged in as Buyer<br />
                            Use the Logout button in the top-right navbar to sign out.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
