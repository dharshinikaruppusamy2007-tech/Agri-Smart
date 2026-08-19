import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Truck, MapPin, Package, BarChart2, CheckCircle,
    AlertTriangle, Sprout, Info, Clock, Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateAgriStats } from '../utils/agriData';

/* ── helpers ─────────────────────────────────────── */
const n = (v) => parseFloat(v) || 0;
const inr = (v) => `₹${n(v).toLocaleString('en-IN')}`;
const kg = (v) => `${n(v).toLocaleString('en-IN')} kg`;

const LS_TRANSPORT_KEY = 'agrismart_transport';

/* ── Status config ────────────────────────────────── */
const STATUSES = ['Pending', 'In Transit', 'Delivered'];
const STATUS_PROGRESS = { Pending: 0, 'In Transit': 50, Delivered: 100 };
const STATUS_CONFIG = {
    Pending: {
        color: 'border-gray-400 bg-gray-50 text-gray-700',
        icon: Clock,
        iconColor: 'text-gray-500',
        badge: 'bg-gray-200 text-gray-700',
        bar: 'bg-gray-400',
    },
    'In Transit': {
        color: 'border-blue-400 bg-blue-50 text-blue-800',
        icon: Truck,
        iconColor: 'text-blue-600',
        badge: 'bg-blue-200 text-blue-800',
        bar: 'bg-blue-500',
    },
    Delivered: {
        color: 'border-agri-400 bg-agri-50 text-agri-800',
        icon: CheckCircle,
        iconColor: 'text-agri-600',
        badge: 'bg-agri-200 text-agri-800',
        bar: 'bg-agri-500',
    },
};

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
                            badge.type === 'danger' ? 'bg-red-200 text-red-800' :
                                badge.type === 'info' ? 'bg-blue-200 text-blue-800' :
                                    'bg-agri-200 text-agri-800'}`}>{badge.text}</span>
                    )}
                    {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
                </div>
            </div>
        </div>
    );
}

/* ── progress bar ────────────────────────────────── */
function ProgressBar({ pct, barClass }) {
    return (
        <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden relative">
            <div
                className={`h-full rounded-full transition-all duration-700 ${barClass}`}
                style={{ width: `${pct}%` }}
            />
            <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-gray-400 opacity-40" />
        </div>
    );
}

/* ══════════════ TRANSPORTATION PAGE ══════════════ */
export default function Transportation() {
    const { harvestInputs } = useAuth();

    /* ── Transport state (persisted to localStorage) ── */
    const [transportState, setTransportState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(LS_TRANSPORT_KEY)) || {
                status: 'Pending',
                source: '',
                destination: '',
            };
        } catch {
            return { status: 'Pending', source: '', destination: '' };
        }
    });

    const { status, source, destination } = transportState;

    /* ── Local draft for Route Details inputs (committed on Save) ── */
    const [draftSource, setDraftSource] = useState(source);
    const [draftDestination, setDraftDestination] = useState(destination);
    const [routeError, setRouteError] = useState('');
    const [routeSaved, setRouteSaved] = useState(false);

    const updateTransport = (fields) => {
        setTransportState(prev => {
            const next = { ...prev, ...fields };
            localStorage.setItem(LS_TRANSPORT_KEY, JSON.stringify(next));
            return next;
        });
    };

    /* Save route with validation */
    const handleSaveRoute = () => {
        if (!draftSource.trim() || !draftDestination.trim()) {
            setRouteError('Please enter source and destination locations.');
            setRouteSaved(false);
            return;
        }
        setRouteError('');
        updateTransport({ source: draftSource.trim(), destination: draftDestination.trim() });
        setRouteSaved(true);
        // Hide the success flash after 2 seconds
        setTimeout(() => setRouteSaved(false), 2000);
    };

    /* ── empty state ── */
    if (!harvestInputs) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-4">
                <Truck size={72} className="text-agri-200" />
                <h2 className="text-2xl font-bold text-gray-700">No Transportation Data Available</h2>
                <p className="text-gray-500 text-center max-w-md">
                    Enter your harvest details first to view transportation management information.
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

    /* ── derived values (same util as Dashboard / Analytics / Storage) ── */
    const stats = useMemo(() => calculateAgriStats(harvestInputs), [harvestInputs]);

    const qty = n(harvestInputs.quantity);
    const capacity = n(harvestInputs.capacity);
    const costPerKm = n(harvestInputs.transportCostPerKm);
    const dist = Math.max(0, n(harvestInputs.distance));

    /* Quantity to transport = excess crop (same as Storage Management) */
    const excessCrop = Math.max(0, qty - capacity);
    const transportQty = excessCrop; // what needs external transport

    /* Transport cost = distance × costPerKm (same formula as agriData.js line 37) */
    const transCost = stats.transCost; // distance * transportCostPerKm

    /* Progress */
    const progress = STATUS_PROGRESS[status] ?? 0;
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['Pending'];
    const StatusIcon = cfg.icon;

    /* Smart insight */
    const insight = (() => {
        if (status === 'Delivered')
            return `✅ Transportation completed successfully for ${kg(transportQty)} of ${harvestInputs.crop}.`;
        if (status === 'In Transit')
            return `🚚 ${kg(transportQty)} of ${harvestInputs.crop} is currently in transit over a distance of ${dist} km.`;
        if (transportQty === 0)
            return `✅ All ${kg(qty)} of ${harvestInputs.crop} fits within your storage capacity. No external transport needed.`;
        return `🚚 Transportation is ready to be scheduled for ${kg(transportQty)} of ${harvestInputs.crop}.`;
    })();

    /* Next status */
    const currentIdx = STATUSES.indexOf(status);
    const nextStatus = currentIdx < STATUSES.length - 1 ? STATUSES[currentIdx + 1] : null;

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Truck className="text-agri-600" size={26} />
                    Transportation Management
                </h1>

                {/* Crop info banner */}
                <div className="bg-agri-50 border border-agri-100 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
                    <Sprout className="text-agri-600 shrink-0" size={22} />
                    <div>
                        <p className="font-bold text-agri-900 text-lg">Crop: {harvestInputs.crop}</p>
                        <p className="text-sm text-agri-700 mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                            <span>Harvest Quantity: <strong>{kg(qty)}</strong></span>
                            <span>Storage Capacity: <strong>{kg(capacity)}</strong></span>
                            <span>Distance: <strong>{dist} km</strong></span>
                            <span>Transport Cost/km: <strong>₹{costPerKm}/km</strong></span>
                        </p>
                    </div>
                </div>

                {/* ── 4 Summary Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    <SummaryCard
                        icon={Sprout}
                        label="Crop"
                        value={harvestInputs.crop}
                        accent="agri"
                    />
                    <SummaryCard
                        icon={Package}
                        label="Quantity to Transport"
                        value={kg(transportQty)}
                        sub={transportQty > 0 ? 'Excess beyond storage capacity' : 'No excess — all stored in-house'}
                        accent={transportQty > 0 ? 'orange' : 'gray'}
                        badge={transportQty > 0 ? { text: 'Needs Transport', type: 'warn' } : { text: 'No Transport Needed', type: 'ok' }}
                    />
                    <SummaryCard
                        icon={Navigation}
                        label="Transport Distance"
                        value={`${dist} km`}
                        sub="From harvest source to market"
                        accent="blue"
                    />
                    <SummaryCard
                        icon={BarChart2}
                        label="Est. Transport Cost"
                        value={inr(transCost)}
                        sub={`₹${costPerKm}/km × ${dist} km`}
                        accent="agri"
                        badge={{ text: 'Same as Dashboard', type: 'ok' }}
                    />
                </div>

                {/* ── Two-column section ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Transport Status + Progress */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                            <Truck size={18} className="text-agri-600" />
                            Transport Status &amp; Progress
                        </h3>

                        {/* Status selector */}
                        <div className="flex gap-2 mb-5">
                            {STATUSES.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => updateTransport({ status: s })}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all duration-200 ${status === s
                                        ? 'border-agri-500 bg-agri-600 text-white shadow-md shadow-agri-500/30'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-agri-300 hover:text-agri-700'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>Progress</span>
                                <span className="font-bold text-gray-700">{progress}%</span>
                            </div>
                            <ProgressBar pct={progress} barClass={cfg.bar} />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Pending</span>
                                <span>In Transit</span>
                                <span>Delivered</span>
                            </div>
                        </div>

                        {/* Status badge */}
                        <div className={`rounded-xl p-4 border-l-4 flex items-center gap-3 mt-2 ${cfg.color}`}>
                            <StatusIcon size={22} className={cfg.iconColor} />
                            <div>
                                <p className="font-bold text-sm">{status}</p>
                                <p className="text-xs opacity-70 mt-0.5">
                                    {status === 'Pending' && 'Awaiting dispatch scheduling.'}
                                    {status === 'In Transit' && `Travelling ${dist} km to destination.`}
                                    {status === 'Delivered' && 'Crop has reached its destination.'}
                                </p>
                            </div>
                            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                                {progress}%
                            </span>
                        </div>

                        {/* Advance button */}
                        {nextStatus && (
                            <button
                                onClick={() => updateTransport({ status: nextStatus })}
                                className="mt-4 w-full bg-agri-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-agri-700 transition flex items-center justify-center gap-2"
                            >
                                <Truck size={16} />
                                Mark as {nextStatus}
                            </button>
                        )}
                        {!nextStatus && (
                            <div className="mt-4 w-full bg-agri-50 border border-agri-200 text-agri-700 py-2.5 rounded-lg font-bold text-sm text-center flex items-center justify-center gap-2">
                                <CheckCircle size={16} />
                                Transportation Complete
                            </div>
                        )}
                    </div>

                    {/* Transportation Details */}
                    <div className="space-y-5">

                        {/* Source / Destination inputs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={18} className="text-agri-600" />
                                Route Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-1">
                                        Source Location
                                    </label>
                                    <input
                                        type="text"
                                        value={draftSource}
                                        onChange={(e) => { setDraftSource(e.target.value); setRouteError(''); setRouteSaved(false); }}
                                        placeholder="Enter source location"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agri-400 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-1">
                                        Destination Location
                                    </label>
                                    <input
                                        type="text"
                                        value={draftDestination}
                                        onChange={(e) => { setDraftDestination(e.target.value); setRouteError(''); setRouteSaved(false); }}
                                        placeholder="Enter destination location"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agri-400 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Validation error */}
                                {routeError && (
                                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                        <AlertTriangle size={14} className="shrink-0" />
                                        {routeError}
                                    </p>
                                )}

                                {/* Save button */}
                                <button
                                    onClick={handleSaveRoute}
                                    className="w-full bg-agri-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-agri-700 transition flex items-center justify-center gap-2"
                                >
                                    <MapPin size={15} />
                                    Save Route
                                </button>

                                {/* Success flash */}
                                {routeSaved && (
                                    <div className="flex items-center gap-2 text-sm text-agri-700 font-medium bg-agri-50 border border-agri-200 rounded-lg px-3 py-2">
                                        <CheckCircle size={14} className="text-agri-500 shrink-0" />
                                        Route saved successfully!
                                    </div>
                                )}

                                {/* Saved route preview */}
                                {source && destination && (
                                    <div className="flex items-center gap-2 text-sm text-agri-700 font-semibold bg-agri-50 border border-agri-200 rounded-lg px-3 py-2.5">
                                        <Truck size={15} className="text-agri-500 shrink-0" />
                                        🚚 {source} → {destination}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cost card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <BarChart2 size={18} className="text-agri-600" />
                                Cost Breakdown
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5 border-b border-gray-50">
                                    <span className="text-gray-500">Transport Cost/km</span>
                                    <span className="font-semibold text-gray-800">₹{costPerKm}/km</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-50">
                                    <span className="text-gray-500">Distance</span>
                                    <span className="font-semibold text-gray-800">{dist} km</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-50">
                                    <span className="text-gray-500">Quantity to Transport</span>
                                    <span className="font-semibold text-gray-800">{kg(transportQty)}</span>
                                </div>
                                <div className="flex justify-between py-2 mt-1 bg-agri-50 rounded-lg px-2">
                                    <span className="font-bold text-agri-800">Est. Transport Cost</span>
                                    <span className="font-bold text-agri-700 text-base">{inr(transCost)}</span>
                                </div>
                                <p className="text-xs text-gray-400 pt-1">Formula: Distance × Cost/km (same as Dashboard)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Full Transportation Details ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <Truck size={18} className="text-agri-600" />
                        Transportation Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-xl bg-agri-50 border border-agri-100 p-4 text-center">
                            <p className="text-xs text-agri-600 font-semibold uppercase tracking-wide mb-1">Crop</p>
                            <p className="text-xl font-bold text-agri-800">{harvestInputs.crop}</p>
                        </div>
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-center">
                            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Quantity</p>
                            <p className="text-xl font-bold text-blue-800">{kg(transportQty)}</p>
                            <p className="text-xs text-gray-400 mt-1">Excess beyond capacity</p>
                        </div>
                        <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 text-center">
                            <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">Distance</p>
                            <p className="text-xl font-bold text-orange-800">{dist} km</p>
                        </div>
                        <div className="rounded-xl bg-agri-50 border border-agri-100 p-4 text-center">
                            <p className="text-xs text-agri-600 font-semibold uppercase tracking-wide mb-1">Est. Total Cost</p>
                            <p className="text-xl font-bold text-agri-800">{inr(transCost)}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center sm:col-span-2">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Source</p>
                            <p className="text-lg font-bold text-gray-800">
                                {source || <span className="text-gray-400 font-normal italic text-sm">Not set — enter above</span>}
                            </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center sm:col-span-2">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Destination</p>
                            <p className="text-lg font-bold text-gray-800">
                                {destination || <span className="text-gray-400 font-normal italic text-sm">Not set — enter above</span>}
                            </p>
                        </div>
                        {source && destination && (
                            <div className="rounded-xl bg-agri-600 border border-agri-700 p-4 text-center sm:col-span-4 flex items-center justify-center gap-3">
                                <Truck size={20} className="text-white shrink-0" />
                                <p className="text-white font-bold text-lg tracking-wide">
                                    🚚 {source} → {destination}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Smart Transport Insight ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Info size={18} className="text-agri-600" />
                        Smart Transport Insight
                    </h3>
                    <p className={`text-sm leading-relaxed p-4 rounded-lg font-medium ${status === 'Delivered'
                        ? 'bg-agri-50  text-agri-800  border border-agri-200'
                        : status === 'In Transit'
                            ? 'bg-blue-50  text-blue-800  border border-blue-200'
                            : transportQty > 0
                                ? 'bg-orange-50 text-orange-800 border border-orange-200'
                                : 'bg-agri-50  text-agri-800  border border-agri-200'
                        }`}>
                        {insight}
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {status === 'Delivered' ? (
                            <>
                                <div className="text-sm bg-agri-50 rounded-lg p-3 border border-agri-100 text-agri-700">
                                    ✅ <strong>{kg(transportQty)}</strong> of {harvestInputs.crop} successfully delivered.
                                </div>
                                <div className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100 text-blue-700">
                                    💡 Total transport cost incurred: <strong>{inr(transCost)}</strong>.
                                </div>
                            </>
                        ) : status === 'In Transit' ? (
                            <>
                                <div className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100 text-blue-700">
                                    🚚 En route — <strong>{dist} km</strong> journey in progress.
                                </div>
                                <div className="text-sm bg-orange-50 rounded-lg p-3 border border-orange-100 text-orange-700">
                                    💡 Ensure proper packaging to minimize spoilage during transit.
                                </div>
                            </>
                        ) : transportQty > 0 ? (
                            <>
                                <div className="text-sm bg-orange-50 rounded-lg p-3 border border-orange-100 text-orange-700">
                                    💡 Schedule transport for <strong>{kg(transportQty)}</strong> that exceeds storage capacity.
                                </div>
                                <div className="text-sm bg-red-50 rounded-lg p-3 border border-red-100 text-red-700">
                                    ⚠️ Excess crop spoilage risk without timely transportation.
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-sm bg-agri-50 rounded-lg p-3 border border-agri-100 text-agri-700">
                                    ✅ All harvested crop fits within your storage capacity.
                                </div>
                                <div className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100 text-blue-700">
                                    💡 Estimated transport cost at current rates: <strong>{inr(transCost)}</strong>.
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
