import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Sprout, Tractor, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateAgriStats } from '../utils/agriData';
import { Link } from 'react-router-dom';

export default function Analytics() {
    const { harvestInputs } = useAuth();

    const stats = useMemo(() => {
        if (!harvestInputs) return null;
        return calculateAgriStats(harvestInputs);
    }, [harvestInputs]);

    if (!harvestInputs || !stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <Tractor className="text-agri-300 w-24 h-24 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Harvest Data Available</h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                    Enter your harvest details in the Dashboard to view performance analytics, profitability, and storage optimization.
                </p>
                <Link to="/dashboard" className="bg-agri-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-agri-700 transition flex items-center gap-2">
                    <Sprout size={20} />
                    Go to Harvest Details
                </Link>
            </div>
        );
    }

    const { revenue, totalCost, netProfit } = stats;
    const netMargin = revenue > 0 ? ((netProfit / revenue) * 100) : 0;
    const isLoss = netProfit < 0;

    // Financial Breakdown Data
    const financialData = [
        { name: 'Prod Cost', value: parseFloat(harvestInputs.productionCost) || 0, color: '#F59E0B' }, // Amber
        { name: 'Storage', value: stats.storageCost, color: '#3B82F6' }, // Blue
        { name: 'Transport', value: stats.transCost, color: '#EF4444' }, // Red
        { name: isLoss ? 'Net Loss' : 'Net Profit', value: Math.abs(netProfit), color: isLoss ? '#ef4444' : '#10B981' } // Green/Red
    ];

    // Harvest & Storage Logic
    const capacityVal = parseFloat(harvestInputs.capacity) || 0;
    const qtyVal = parseFloat(harvestInputs.quantity) || 0;

    const storageData = [
        { name: 'Harvest Qty', value: qtyVal, fill: '#84cc16' },
        { name: 'Storage Cap', value: capacityVal, fill: '#3b82f6' },
        { name: 'Excess Crop', value: stats.excessStorage, fill: '#f97316' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-agri-600" />
                    Performance Analytics
                </h1>

                {/* Crop Analyzed Prompt */}
                <div className="bg-agri-50 border border-agri-100 rounded-xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-agri-900 flex items-center gap-2">
                            <Sprout className="text-agri-600" size={20} />
                            Crop Analyzed: {harvestInputs.crop}
                        </h2>
                        <p className="text-sm text-agri-700 mt-1">
                            Harvest Quantity: <strong>{harvestInputs.quantity} kg</strong> &bull; Recommended Price: <strong>₹{stats.recommendedPrice}/kg</strong> &bull; Excess Crop: <strong>{stats.excessStorage} kg</strong>
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
                        <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            ₹ {revenue.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Total Cost</div>
                        <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            ₹ {totalCost.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">{isLoss ? "Net Loss" : "Net Profit"}</div>
                        <div className={`text-2xl font-bold flex items-center gap-2 ${isLoss ? 'text-red-600' : 'text-agri-700'}`}>
                            ₹ {Math.abs(netProfit).toLocaleString('en-IN')}
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${isLoss ? 'bg-red-100 text-red-700' : 'bg-agri-100 text-agri-700'}`}>
                                {isLoss ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Net Margin</div>
                        <div className={`text-2xl font-bold ${isLoss ? 'text-red-600' : 'text-agri-700'}`}>
                            {netMargin.toFixed(2)}%
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Financial Breakdown */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Financial Breakdown</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financialData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                                    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {financialData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Harvest & Storage Analysis */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Harvest & Storage Analysis</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={storageData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                                    <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(val) => `${val}kg`} />
                                    <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(value) => [`${value} kg`, 'Quantity']} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                                        {storageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
