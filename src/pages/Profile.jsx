import React, { useState, useMemo } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import {
    User, Phone, Mail, MapPin, Calendar, Pencil, CheckCircle,
    XCircle, LogOut, Sprout, Wheat, TrendingUp, Warehouse, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateAgriStats } from '../utils/agriData';

/* ── helpers ────────────────────────────────────────── */
const fmt = (val) => (val && val !== 'undefined' && val !== 'null' ? val : 'N/A');
const fmtDate = (iso) => {
    if (!iso) return 'N/A';
    try { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return 'N/A'; }
};
const isValidPhone = (p) => /^[6-9]\d{9}$/.test(p.replace(/\s+/g, ''));
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ── stat card ──────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent = 'agri' }) {
    const colors = {
        agri: 'bg-agri-50 text-agri-700 border-agri-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        orange: 'bg-orange-50 text-orange-700 border-orange-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return (
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${colors[accent]}`}>
            <div className="p-2 rounded-lg bg-white/60">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs font-medium opacity-70">{label}</p>
                <p className="text-base font-bold">{value}</p>
            </div>
        </div>
    );
}

/* ── info row ───────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <Icon size={18} className="text-agri-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800 break-all">{fmt(value)}</p>
            </div>
        </div>
    );
}

/* ── field ──────────────────────────────────────────── */
function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        </div>
    );
}

/* ══════════════════ PROFILE PAGE ═══════════════════ */
export default function Profile() {
    const { user, updateUser, logout, harvestInputs } = useAuth();
    const navigate = useNavigate();

    /* ── redirect if not logged in ── */
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-4">
                <User size={64} className="text-gray-300" />
                <h2 className="text-xl font-bold text-gray-700">No farmer profile found.</h2>
                <Link to="/login" className="bg-agri-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-agri-700 transition">
                    Go to Login
                </Link>
            </div>
        );
    }

    /* ── harvest stats ── */
    const harvestStats = useMemo(() => {
        if (!harvestInputs) return null;
        return calculateAgriStats(harvestInputs);
    }, [harvestInputs]);

    const storageUtil = harvestInputs && harvestStats
        ? Math.round((harvestStats.ownStorageUsed / (parseFloat(harvestInputs.capacity) || 1)) * 100)
        : null;

    /* ── edit state ── */
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '', email: user.email || '', location: user.location || '' });
    const [errors, setErrors] = useState({});

    const startEdit = () => {
        setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '', location: user.location || '' });
        setErrors({});
        setEditing(true);
    };
    const cancelEdit = () => { setEditing(false); setErrors({}); };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required.';
        if (user.role === 'farmer') {
            if (!form.phone.trim()) e.phone = 'Phone number is required.';
            else if (!isValidPhone(form.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.';
        }
        if (form.email && !isValidEmail(form.email)) e.email = 'Enter a valid email address.';
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        updateUser({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), location: form.location.trim() });
        setEditing(false);
        setErrors({});
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    /* ─────────────── render ────────────────────────── */
    return (
        <div className="min-h-screen bg-gray-50 pb-12 pt-6">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Page title ── */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="text-agri-600" size={24} />
                    My Profile
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ══ LEFT – Profile card ══ */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Avatar + name */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-agri-100 flex items-center justify-center mb-4 ring-4 ring-agri-200">
                                <User size={44} className="text-agri-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{fmt(user.name)}</h2>
                            <span className="mt-1 text-sm font-medium text-agri-600 capitalize bg-agri-50 px-3 py-1 rounded-full">
                                {fmt(user.role)}
                            </span>
                            {user.location && (
                                <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin size={13} className="text-gray-400" />{user.location}
                                </p>
                            )}

                            {/* Action buttons */}
                            <div className="mt-5 w-full flex flex-col gap-2">
                                {!editing ? (
                                    <button onClick={startEdit}
                                        className="w-full flex items-center justify-center gap-2 bg-agri-600 hover:bg-agri-700 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                                        <Pencil size={15} /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={handleSave}
                                            className="flex-1 flex items-center justify-center gap-1 bg-agri-600 hover:bg-agri-700 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                                            <CheckCircle size={15} /> Save
                                        </button>
                                        <button onClick={cancelEdit}
                                            className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition">
                                            <XCircle size={15} /> Cancel
                                        </button>
                                    </div>
                                )}
                                <button onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold transition">
                                    <LogOut size={15} /> Logout
                                </button>
                            </div>
                        </div>

                        {/* Harvest Stats (small) */}
                        {user.role === 'farmer' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-agri-600" /> Harvest Summary
                                </h3>
                                {harvestInputs && harvestStats ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <StatCard icon={Wheat} label="Crop" value={harvestInputs.crop} accent="agri" />
                                        <StatCard icon={Warehouse} label="Quantity" value={`${harvestInputs.quantity} kg`} accent="blue" />
                                        <StatCard icon={TrendingUp} label="Revenue" value={`₹${harvestStats.revenue.toLocaleString('en-IN')}`} accent="agri" />
                                        <StatCard
                                            icon={harvestStats.netProfit >= 0 ? TrendingUp : AlertCircle}
                                            label={harvestStats.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                                            value={`₹${Math.abs(harvestStats.netProfit).toLocaleString('en-IN')}`}
                                            accent={harvestStats.netProfit >= 0 ? 'agri' : 'orange'}
                                        />
                                        <StatCard icon={Warehouse} label="Storage Used" value={`${storageUtil}%`} accent="purple" />
                                        <StatCard icon={AlertCircle} label="Excess Crop" value={`${harvestStats.excessStorage} kg`} accent="orange" />
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Sprout size={32} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">No harvest data available.</p>
                                        <Link to="/dashboard" className="text-agri-600 text-sm font-semibold hover:underline">Go to Harvest Details →</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ══ RIGHT – Details / Edit form ══ */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <User size={18} className="text-agri-600" /> Personal Information
                            </h3>

                            {!editing ? (
                                /* ── View mode ── */
                                <div>
                                    <InfoRow icon={User} label="Full Name" value={user.name} />
                                    {user.role === 'farmer' && <InfoRow icon={Phone} label="Mobile Number" value={user.phone} />}
                                    <InfoRow icon={Mail} label="Email Address" value={user.email} />
                                    <InfoRow icon={MapPin} label="Location" value={user.location} />
                                    <InfoRow icon={User} label="Role" value={user.role} />
                                    <InfoRow icon={Calendar} label="Registered On" value={fmtDate(user.registeredAt)} />
                                </div>
                            ) : (
                                /* ── Edit mode ── */
                                <div className="space-y-4">
                                    <Field label="Full Name *" error={errors.name}>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-agri-500'} focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-sm`}
                                            placeholder="Your full name"
                                        />
                                    </Field>

                                    {user.role === 'farmer' && (
                                        <Field label="Mobile Number *" error={errors.phone}>
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-agri-500'} focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-sm`}
                                                placeholder="10-digit Indian mobile (e.g. 9876543210)"
                                            />
                                        </Field>
                                    )}

                                    <Field label="Email Address" error={errors.email}>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-agri-500'} focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-sm`}
                                            placeholder="your@email.com (optional)"
                                        />
                                    </Field>

                                    <Field label="Location">
                                        <input
                                            type="text"
                                            value={form.location}
                                            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white text-sm"
                                            placeholder="e.g. Madurai, Tamil Nadu"
                                        />
                                    </Field>

                                    <div className="pt-2 flex gap-3">
                                        <button onClick={handleSave}
                                            className="flex items-center gap-2 bg-agri-600 hover:bg-agri-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                                            <CheckCircle size={16} /> Save Changes
                                        </button>
                                        <button onClick={cancelEdit}
                                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                                            <XCircle size={16} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Detailed Harvest Analytics – Farmer only */}
                        {user.role === 'farmer' && harvestInputs && harvestStats && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-agri-600" /> Current Harvest Details
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    {[
                                        { label: 'Total Harvest', value: `${harvestInputs.quantity} kg` },
                                        { label: 'Current Crop', value: harvestInputs.crop },
                                        { label: 'Total Revenue', value: `₹${harvestStats.revenue.toLocaleString('en-IN')}` },
                                        { label: 'Net Profit', value: `₹${Math.abs(harvestStats.netProfit).toLocaleString('en-IN')}`, negative: harvestStats.netProfit < 0 },
                                        { label: 'Production Cost', value: `₹${harvestStats.totalCost.toLocaleString('en-IN')}` },
                                        { label: 'Storage Used', value: `${storageUtil}%` },
                                        { label: 'Excess Crop', value: `${harvestStats.excessStorage} kg` },
                                        { label: 'Rec. Price', value: `₹${harvestStats.recommendedPrice}/kg` },
                                    ].map(({ label, value, negative }) => (
                                        <div key={label} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-500 mb-1">{label}</p>
                                            <p className={`font-bold text-sm ${negative ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
