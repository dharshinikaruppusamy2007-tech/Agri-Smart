import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Warehouse, AlertTriangle, CheckCircle, BarChart2,
    Package, Sprout, Info, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateAgriStats } from '../utils/agriData';

/* ── helpers ─────────────────────────────────────── */
const n = (v) => parseFloat(v) || 0;
const inr = (v) => `₹${n(v).toLocaleString('en-IN')}`;
const kg = (v) => `${n(v).toLocaleString('en-IN')} kg`;

/* ── small stat card ─────────────────────────────── */
function SummaryCard({ icon: Icon, label, value, sub, accent = 'agri', badge }) {
    const palettes = {
        agri: 'border-agri-400   bg-agri-50   text-agri-800',
        blue: 'border-blue-400   bg-blue-50   text-blue-800',
        orange: 'border-orange-400 bg-orange-50 text-orange-800',
        red: 'border-red-400    bg-red-50    text-red-800',
        gray: 'border-gray-300   bg-gray-50   text-gray-700',
    };
    const iconPalettes = {
        agri: 'bg-agri-100   text-agri-600',
        blue: 'bg-blue-100   text-blue-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100    text-red-600',
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
                    <p className="text-2xl font-bold leading-tight">{value}</p>
                    {badge && (
                        <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge.type === 'warn' ? 'bg-orange-200 text-orange-800' :
                            badge.type === 'danger' ? 'bg-red-200    text-red-800' :
                                'bg-agri-200   text-agri-800'
                            }`}>{badge.text}</span>
                    )}
                    {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
                </div>
            </div>
        </div>
    );
}

/* ── progress bar ────────────────────────────────── */
function ProgressBar({ filled, overflow, label }) {
    // filled  = 0–100 (portion within capacity)
    // overflow= true when harvest > capacity
    const pct = Math.min(filled, 100);
    return (
        <div className="space-y-1.5">
            {label && <p className="text-xs text-gray-500 font-medium">{label}</p>}
            <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${overflow ? 'bg-red-400' : pct > 85 ? 'bg-orange-400' : 'bg-agri-500'}`}
                    style={{ width: `${pct}%` }}
                />
                {/* 100% tick mark */}
                <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-gray-400 opacity-40" />
            </div>
        </div>
    );
}

/* ══════════════ STORAGE MANAGEMENT PAGE ══════════════ */
export default function StorageManagement() {
    const { harvestInputs } = useAuth();

    /* ── empty state ── */
    if (!harvestInputs) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-4">
                <Warehouse size={72} className="text-agri-200" />
                <h2 className="text-2xl font-bold text-gray-700">No Harvest Data Available</h2>
                <p className="text-gray-500 text-center max-w-md">
                    Enter your harvest details first to view storage management information.
                </p>
                <Link
                    to="/dashboard"
                    className="mt-2 bg-agri-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-agri-700 transition flex items-center gap-2"
                >
                    <Sprout size={18} /> Go to Harvest Details
                </Link>
            </div>
        );
    }

    /* ── derived values (no duplication — same util as Dashboard & Analytics) ── */
    const stats = useMemo(() => calculateAgriStats(harvestInputs), [harvestInputs]);

    const qty = n(harvestInputs.quantity);
    const capacity = n(harvestInputs.capacity);
    const costPerKg = n(harvestInputs.storageCostPerKg);

    const storedQty = Math.min(qty, capacity);          // what fits
    const excessCrop = Math.max(0, qty - capacity);      // what doesn't fit
    const remainingCap = Math.max(0, capacity - qty);      // spare room (if any)
    const utilization = capacity > 0 ? (qty / capacity) * 100 : 0;
    const displayUtilization = Math.min(utilization, 100);  // capped at 100% for UI display only
    const isExceeded = qty > capacity;
    const storageCost = stats.storageCost;                // ₹ — from shared util
    const progressFilled = capacity > 0 ? (storedQty / capacity) * 100 : 0;

    /* ── smart insight ── */
    const insight = isExceeded
        ? `⚠️ Your harvest exceeds available storage by ${kg(excessCrop)}. Consider arranging additional storage capacity to reduce potential post-harvest losses.`
        : `✅ Your current storage capacity is sufficient for this harvest. You have ${kg(remainingCap)} of remaining storage capacity available.`;

    /* ─────────────────────────── render ───────────────────────────── */
    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Warehouse className="text-agri-600" size={26} />
                    Storage Management
                </h1>

                {/* Crop info banner */}
                <div className="bg-agri-50 border border-agri-100 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
                    <Sprout className="text-agri-600 shrink-0" size={22} />
                    <div>
                        <p className="font-bold text-agri-900 text-lg">Crop Stored: {harvestInputs.crop}</p>
                        <p className="text-sm text-agri-700 mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                            <span>Harvest Quantity: <strong>{kg(qty)}</strong></span>
                            <span>Storage Capacity: <strong>{kg(capacity)}</strong></span>
                            <span>Storage Cost: <strong>₹{costPerKg}/kg</strong></span>
                        </p>
                    </div>
                </div>

                {/* ── 4 Summary Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    <SummaryCard
                        icon={Package}
                        label="Harvest Quantity"
                        value={kg(qty)}
                        accent="agri"
                    />
                    <SummaryCard
                        icon={Warehouse}
                        label="Storage Capacity"
                        value={kg(capacity)}
                        accent="blue"
                    />
                    <SummaryCard
                        icon={BarChart2}
                        label="Storage Utilization"
                        value={`${displayUtilization.toFixed(1)}%`}
                        sub={isExceeded ? `Capacity Exceeded by: ${kg(excessCrop)}` : `Remaining Capacity: ${kg(remainingCap)}`}
                        accent={isExceeded ? 'red' : utilization > 85 ? 'orange' : 'agri'}
                        badge={isExceeded
                            ? { text: 'Capacity Exceeded', type: 'danger' }
                            : utilization > 85
                                ? { text: 'Near Full', type: 'warn' }
                                : { text: 'Within Capacity', type: 'ok' }}
                    />
                    <SummaryCard
                        icon={AlertTriangle}
                        label="Excess Crop"
                        value={kg(excessCrop)}
                        accent={excessCrop > 0 ? 'orange' : 'gray'}
                        sub={excessCrop > 0 ? 'Requires external storage' : 'No excess — all within capacity'}
                    />
                </div>

                {/* ── Two-column section ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Storage Capacity Visual */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                            <BarChart2 size={18} className="text-agri-600" />
                            Capacity Visualization
                        </h3>

                        {/* Progress bar */}
                        <ProgressBar filled={progressFilled} overflow={isExceeded} />

                        {/* Legend */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="bg-agri-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-agri-600 font-semibold mb-1">Stored (fits)</p>
                                <p className="text-lg font-bold text-agri-800">{kg(storedQty)}</p>
                                <p className="text-xs text-gray-400">of {kg(capacity)} capacity</p>
                            </div>
                            {isExceeded ? (
                                <div className="bg-red-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-red-600 font-semibold mb-1">Excess Crop</p>
                                    <p className="text-lg font-bold text-red-700">{kg(excessCrop)}</p>
                                    <p className="text-xs text-gray-400">beyond capacity</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-blue-600 font-semibold mb-1">Remaining Capacity</p>
                                    <p className="text-lg font-bold text-blue-700">{kg(remainingCap)}</p>
                                    <p className="text-xs text-gray-400">still available</p>
                                </div>
                            )}
                        </div>

                        {/* Utilization label */}
                        <p className={`mt-4 text-sm font-semibold text-center py-2 rounded-lg ${isExceeded
                            ? 'bg-red-50 text-red-700'
                            : utilization > 85
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-agri-50 text-agri-700'
                            }`}>
                            {isExceeded
                                ? `Capacity exceeded — ${displayUtilization.toFixed(1)}% utilization · Excess: ${kg(excessCrop)}`
                                : `${displayUtilization.toFixed(1)}% utilized — ${kg(remainingCap)} remaining`}
                        </p>
                    </div>

                    {/* Storage Cost + Status */}
                    <div className="space-y-5">

                        {/* Estimated Storage Cost */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-agri-600" />
                                Estimated Storage Cost
                            </h3>
                            <div className="flex items-end gap-2 mb-3">
                                <span className="text-3xl font-bold text-agri-700">{inr(storageCost)}</span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>{kg(storedQty)} stored × ₹{costPerKg}/kg</p>
                                {excessCrop > 0 && (
                                    <p className="text-orange-600 font-medium">
                                        ⚠️ {kg(excessCrop)} excess crop may need external storage at additional cost.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Storage Status */}
                        <div className={`rounded-xl p-5 border ${isExceeded
                            ? 'bg-red-50 border-red-200'
                            : 'bg-agri-50 border-agri-200'
                            }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {isExceeded
                                    ? <AlertTriangle size={20} className="text-red-600" />
                                    : <CheckCircle size={20} className="text-agri-600" />
                                }
                                <h3 className={`font-bold text-base ${isExceeded ? 'text-red-800' : 'text-agri-900'}`}>
                                    {isExceeded ? 'Storage Capacity Exceeded' : 'Storage Capacity Available'}
                                </h3>
                            </div>
                            <p className={`text-sm leading-relaxed ${isExceeded ? 'text-red-700' : 'text-agri-700'}`}>
                                {isExceeded
                                    ? `Your harvested quantity exceeds the available storage capacity by ${kg(excessCrop)}.`
                                    : 'Your current storage capacity is sufficient for the harvested crop.'}
                            </p>
                            {isExceeded && (
                                <div className="mt-3 bg-red-100 rounded-lg px-4 py-2 inline-block">
                                    <p className="text-red-800 font-bold text-sm">Excess Crop: {kg(excessCrop)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Storage Breakdown ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <Warehouse size={18} className="text-agri-600" />
                        Storage Breakdown
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl bg-agri-50 border border-agri-100 p-4 text-center">
                            <p className="text-xs text-agri-600 font-semibold uppercase tracking-wide mb-1">Available Storage</p>
                            <p className="text-2xl font-bold text-agri-800">{kg(capacity)}</p>
                            <p className="text-xs text-gray-400 mt-1">Total capacity</p>
                        </div>
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-center">
                            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Harvested Crop</p>
                            <p className="text-2xl font-bold text-blue-800">{kg(qty)}</p>
                            <p className="text-xs text-gray-400 mt-1">{kg(storedQty)} stored in-house</p>
                        </div>
                        <div className={`rounded-xl border p-4 text-center ${excessCrop > 0 ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${excessCrop > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                                {excessCrop > 0 ? 'Excess Crop' : 'Remaining Capacity'}
                            </p>
                            <p className={`text-2xl font-bold ${excessCrop > 0 ? 'text-orange-700' : 'text-gray-700'}`}>
                                {excessCrop > 0 ? kg(excessCrop) : kg(remainingCap)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {excessCrop > 0 ? 'Needs external storage' : 'Spare capacity available'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Smart Storage Insight ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Info size={18} className="text-agri-600" />
                        Smart Storage Insight
                    </h3>
                    <p className={`text-sm leading-relaxed p-4 rounded-lg font-medium ${isExceeded
                        ? 'bg-orange-50 text-orange-800 border border-orange-200'
                        : 'bg-agri-50  text-agri-800  border border-agri-200'
                        }`}>
                        {insight}
                    </p>

                    {/* quick tip grid */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {isExceeded ? (
                            <>
                                <div className="text-sm bg-red-50 rounded-lg p-3 border border-red-100 text-red-700">
                                    💡 Contact nearby cold-storage or warehouse facilities for the excess <strong>{kg(excessCrop)}</strong>.
                                </div>
                                <div className="text-sm bg-orange-50 rounded-lg p-3 border border-orange-100 text-orange-700">
                                    💡 Consider selling excess stock quickly to reduce spoilage risk for high-perishability crops.
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-sm bg-agri-50 rounded-lg p-3 border border-agri-100 text-agri-700">
                                    ✅ <strong>{kg(remainingCap)}</strong> spare capacity available for additional harvest.
                                </div>
                                <div className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100 text-blue-700">
                                    💡 Estimated storage cost at current rates: <strong>{inr(storageCost)}</strong>.
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
