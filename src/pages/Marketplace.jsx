import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Store, Search, SlidersHorizontal, Sprout, Package,
    MapPin, Navigation, Warehouse, Truck, IndianRupee,
    X, ChevronDown, BarChart2, AlertCircle, ArrowUpDown,
    Eye, Tag, Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateAgriStats, CROP_DATA } from '../utils/agriData';

/* ── helpers ──────────────────────────────────── */
const n = (v) => parseFloat(v) || 0;
const kg = (v) => `${n(v).toLocaleString('en-IN')} kg`;
const inr = (v, unit = '') => `₹${n(v).toLocaleString('en-IN', { minimumFractionDigits: 0 })}${unit}`;

const LS_HARVEST_KEY = 'agrismart_harvest';
const LS_TRANSPORT_KEY = 'agrismart_transport';
const LS_USER_KEY = 'agrismart_user';

/**
 * Read all available farmer harvest listings from localStorage.
 * Currently the app stores one harvest record keyed to agrismart_harvest,
 * along with transport data in agrismart_transport and farmer user in agrismart_user.
 * Returns an array so the UI is ready for multiple records in future phases.
 */
function readMarketplaceListings() {
    try {
        // Prefer array of records for marketplace
        const recordsRaw = localStorage.getItem('agrismart_harvest_records');
        const records = recordsRaw ? JSON.parse(recordsRaw) : [];
        // Fallback to single harvest object for backward compatibility
        if (!records || records.length === 0) {
            const harvestRaw = localStorage.getItem(LS_HARVEST_KEY);
            if (!harvestRaw) return [];
            const harvest = JSON.parse(harvestRaw);
            if (!harvest.crop) return [];
            const transportRaw = localStorage.getItem(LS_TRANSPORT_KEY);
            const farmerRaw = localStorage.getItem(LS_USER_KEY);
            const transport = transportRaw ? JSON.parse(transportRaw) : {};
            const farmer = farmerRaw ? JSON.parse(farmerRaw) : {};
            const stats = calculateAgriStats(harvest);
            return [{
                id: 'listing-1',
                crop: harvest.crop || '',
                quantity: n(harvest.quantity),
                recommendedPrice: n(harvest.recommendedPrice) || stats.recommendedPrice,
                // derived fields
                ...stats,
                farmerName: farmer.name || 'Farmer',
                source: transport.source || '',
                destination: transport.destination || '',
                storageUtilPct: harvest.capacity > 0 ? Math.min(100, Math.round((n(harvest.quantity) / n(harvest.capacity)) * 100)) : 0,
            }];
        }
        // Map each record to UI shape
        return records.map(rec => {
            const stats = calculateAgriStats(rec);
            return {
                id: rec.id || crypto.randomUUID(),
                crop: rec.crop || '',
                quantity: n(rec.quantity),
                recommendedPrice: n(rec.recommendedPrice) || stats.recommendedPrice,
                // derived fields
                ...stats,
                farmerName: rec.farmerName || 'Farmer',
                source: rec.source || '',
                destination: rec.destination || '',
                storageUtilPct: rec.capacity > 0 ? Math.min(100, Math.round((n(rec.quantity) / n(rec.capacity)) * 100)) : 0,
            };
        });
    } catch {
        return [];
    }
}

/* ── CropDetailModal ──────────────────────────── */
function CropDetailModal({ listing, onClose }) {
    if (!listing) return null;

    const rows = [
        ['Crop', listing.crop],
        ['Available Quantity', kg(listing.quantity)],
        ['Recommended Price', inr(listing.recommendedPrice, '/kg')],
        ['Farmer', listing.farmerName],
        ['Source', listing.source || 'N/A'],
        ['Destination', listing.destination || 'N/A'],
        ['Storage Capacity', kg(listing.capacity)],
        ['Storage Used', kg(listing.ownStorageUsed)],
        ['Storage Utilisation', `${listing.storageUtilPct}%`],
        ['Excess (needs transport)', kg(listing.excessStorage)],
        ['Transport Distance', listing.distance ? `${listing.distance} km` : 'N/A'],
        ['Transport Status', listing.transportStatus],
        ['Est. Transport Cost', inr(listing.transCost)],
        ['Spoilage Risk', `${listing.spoilageRisk}%`],
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-agri-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Sprout size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">{listing.crop}</h2>
                            <p className="text-agri-200 text-xs">Crop Details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[65vh]">
                    <div className="grid grid-cols-1 gap-2">
                        {rows.map(([label, value]) => (
                            <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                                <span className="text-sm text-gray-500">{label}</span>
                                <span className="text-sm font-semibold text-gray-800 text-right max-w-[55%]">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Route */}
                    {listing.source && listing.destination && (
                        <div className="mt-4 flex items-center gap-2 bg-agri-50 border border-agri-200 rounded-xl px-4 py-3 text-sm text-agri-700 font-semibold">
                            <Truck size={15} className="text-agri-500 shrink-0" />
                            🚚 {listing.source} → {listing.destination}
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── CropCard ─────────────────────────────────── */
function CropCard({ listing, onViewDetails }) {
    const spoilageColor =
        listing.spoilageRisk >= 20 ? 'text-red-600 bg-red-50 border-red-200' :
            listing.spoilageRisk >= 10 ? 'text-orange-600 bg-orange-50 border-orange-200' :
                'text-agri-700 bg-agri-50 border-agri-200';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            {/* Coloured top strip */}
            <div className="bg-agri-600 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Sprout size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{listing.crop}</h3>
                        <p className="text-agri-200 text-xs">Fresh harvest</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white font-bold text-xl">{inr(listing.recommendedPrice)}</p>
                    <p className="text-agri-200 text-xs">per kg</p>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
                {/* Quantity + spoilage */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Package size={15} className="text-agri-500 shrink-0" />
                        <span className="font-semibold">{kg(listing.quantity)}</span>
                        <span className="text-gray-400">available</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${spoilageColor}`}>
                        {listing.spoilageRisk}% spoilage risk
                    </span>
                </div>

                {/* Farmer */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Warehouse size={14} className="text-agri-500 shrink-0" />
                    <span>Farmer:</span>
                    <span className="font-semibold text-gray-800">{listing.farmerName}</span>
                </div>

                {/* Source / Destination */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-agri-500 shrink-0" />
                    <span>Source:</span>
                    <span className="font-semibold text-gray-800">{listing.source || <span className="text-gray-400 italic font-normal">N/A</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Navigation size={14} className="text-blue-500 shrink-0" />
                    <span>Destination:</span>
                    <span className="font-semibold text-gray-800">{listing.destination || <span className="text-gray-400 italic font-normal">N/A</span>}</span>
                </div>

                {/* Route preview */}
                {listing.source && listing.destination && (
                    <div className="flex items-center gap-1.5 text-xs text-agri-700 font-medium bg-agri-50 border border-agri-200 rounded-lg px-3 py-1.5">
                        <Truck size={12} className="text-agri-500" />
                        {listing.source} → {listing.destination}
                    </div>
                )}

                {/* Price + transport cost strip */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                        <p className="text-xs text-gray-400 mb-0.5">Est. Transport</p>
                        <p className="text-sm font-bold text-gray-700">{inr(listing.transCost)}</p>
                    </div>
                    <div className="bg-agri-50 rounded-lg p-2.5 text-center">
                        <p className="text-xs text-agri-500 mb-0.5">Storage used</p>
                        <p className="text-sm font-bold text-agri-700">{listing.storageUtilPct}%</p>
                    </div>
                </div>

                {/* View Details button */}
                <button
                    onClick={() => onViewDetails(listing)}
                    className="w-full flex items-center justify-center gap-2 mt-1 bg-agri-600 hover:bg-agri-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm shadow-agri-600/20"
                >
                    <Eye size={15} />
                    View Details
                </button>
            </div>
        </div>
    );
}

/* ══════════════ MARKETPLACE PAGE ════════════════ */
export default function Marketplace() {
    const { user } = useAuth();

    // Read actual listings from localStorage (live — no fake data)
    const allListings = useMemo(() => readMarketplaceListings(), []);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    // Filter state
    const [filterCrop, setFilterCrop] = useState('All');
    // Sort state
    const [sortKey, setSortKey] = useState('');
    // Modal
    const [modalListing, setModalListing] = useState(null);

    /* Unique crop types from actual data (for filter dropdown) */
    const cropTypes = useMemo(() => {
        const types = [...new Set(allListings.map(l => l.crop))].filter(Boolean);
        return ['All', ...types];
    }, [allListings]);

    /* Derived + filtered + sorted listings */
    const displayed = useMemo(() => {
        let list = [...allListings];

        // Filter by crop type
        if (filterCrop !== 'All') {
            list = list.filter(l => l.crop === filterCrop);
        }

        // Search by crop name (case-insensitive)
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(l => l.crop.toLowerCase().includes(q));
        }

        // Sort
        if (sortKey === 'price-asc') list.sort((a, b) => a.recommendedPrice - b.recommendedPrice);
        if (sortKey === 'price-desc') list.sort((a, b) => b.recommendedPrice - a.recommendedPrice);
        if (sortKey === 'qty-asc') list.sort((a, b) => a.quantity - b.quantity);
        if (sortKey === 'qty-desc') list.sort((a, b) => b.quantity - a.quantity);

        return list;
    }, [allListings, filterCrop, searchQuery, sortKey]);

    /* Summary stats */
    const summary = useMemo(() => ({
        cropTypes: [...new Set(allListings.map(l => l.crop))].length,
        totalQty: allListings.reduce((s, l) => s + l.quantity, 0),
        avgPrice: allListings.length
            ? allListings.reduce((s, l) => s + l.recommendedPrice, 0) / allListings.length
            : 0,
        count: allListings.length,
    }), [allListings]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-6 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Page header ── */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="bg-agri-600 p-2.5 rounded-xl">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                        </div>
                        <p className="text-gray-500 text-sm ml-[52px]">
                            Fresh Crops Directly From Farmers
                        </p>
                        <p className="text-gray-400 text-xs ml-[52px] mt-0.5">
                            Browse available crops, compare prices, and find produce that matches your requirements.
                        </p>
                    </div>

                    {/* ── Summary cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                        <div className="bg-white rounded-xl border-l-4 border-agri-400 p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-agri-100 p-2 rounded-lg shrink-0">
                                    <Tag size={18} className="text-agri-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Crop Types</p>
                                    <p className="text-2xl font-bold text-agri-800">{summary.cropTypes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border-l-4 border-blue-400 p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                                    <Package size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Total Available</p>
                                    <p className="text-2xl font-bold text-blue-800">{summary.totalQty.toLocaleString('en-IN')} kg</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border-l-4 border-orange-400 p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg shrink-0">
                                    <IndianRupee size={18} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Avg. Price</p>
                                    <p className="text-2xl font-bold text-orange-800">
                                        {summary.avgPrice > 0 ? inr(summary.avgPrice, '/kg') : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Search + Filter + Sort bar ── */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search crops..."
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-400 focus:border-transparent bg-gray-50 focus:bg-white transition"
                            />
                        </div>

                        {/* Crop filter */}
                        <div className="relative">
                            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select
                                value={filterCrop}
                                onChange={e => setFilterCrop(e.target.value)}
                                className="pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-400 bg-gray-50 focus:bg-white transition appearance-none cursor-pointer"
                            >
                                {cropTypes.map(t => (
                                    <option key={t} value={t}>{t === 'All' ? 'All Crops' : t}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select
                                value={sortKey}
                                onChange={e => setSortKey(e.target.value)}
                                className="pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-400 bg-gray-50 focus:bg-white transition appearance-none cursor-pointer"
                            >
                                <option value="">Sort By</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="qty-asc">Quantity: Low → High</option>
                                <option value="qty-desc">Quantity: High → Low</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* ── Results label ── */}
                    {allListings.length > 0 && (
                        <p className="text-xs text-gray-400 mb-4 font-medium">
                            Showing {displayed.length} of {allListings.length} listing{allListings.length !== 1 ? 's' : ''}
                            {searchQuery && ` matching "${searchQuery}"`}
                            {filterCrop !== 'All' && ` · filtered by ${filterCrop}`}
                        </p>
                    )}

                    {/* ── Crop listing grid ── */}
                    {displayed.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {displayed.map(listing => (
                                <CropCard
                                    key={listing.id}
                                    listing={listing}
                                    onViewDetails={setModalListing}
                                />
                            ))}
                        </div>
                    ) : allListings.length === 0 ? (
                        /* No harvest data at all */
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                                <AlertCircle size={36} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">No Crops Available</h3>
                            <p className="text-gray-400 text-sm max-w-sm">
                                Farmers have not added any harvest data yet. Check back soon as new listings
                                appear when farmers submit their harvest details.
                            </p>
                            <Link
                                to="/market"
                                className="mt-6 inline-flex items-center gap-2 bg-agri-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-agri-700 transition"
                            >
                                <BarChart2 size={15} />
                                View Market Prices Instead
                            </Link>
                        </div>
                    ) : (
                        /* Search/filter returned no results */
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center">
                            <Search size={36} className="text-gray-300 mb-4" />
                            <h3 className="text-base font-bold text-gray-600 mb-1">No results found</h3>
                            <p className="text-gray-400 text-sm">
                                No crops match <strong>"{searchQuery || filterCrop}"</strong>. Try a different search.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setFilterCrop('All'); setSortKey(''); }}
                                className="mt-4 text-agri-600 font-semibold text-sm hover:text-agri-700"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Detail modal */}
            {modalListing && (
                <CropDetailModal
                    listing={modalListing}
                    onClose={() => setModalListing(null)}
                />
            )}
        </>
    );
}
