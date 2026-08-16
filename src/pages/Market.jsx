import React from 'react';
import { CROP_DATA } from '../utils/agriData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';

export default function Market() {
    const marketTrends = Object.keys(CROP_DATA).map(crop => ({
        name: crop,
        price: CROP_DATA[crop].marketPrice,
        high: CROP_DATA[crop].high,
        low: CROP_DATA[crop].low,
        spoilageRisk: CROP_DATA[crop].spoilageRisk
    }));

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Live Market Prices</h1>
                        <p className="text-gray-500 mt-2">Real-time agricultural commodity prices and trends</p>
                    </div>
                    <div className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Updates Active
                    </div>
                </div>

                {/* Main Graph */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-agri-600" /> Average Market Price Trends (₹)
                    </h2>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={marketTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 14 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Price']}
                                />
                                <Line type="monotone" dataKey="price" stroke="#2F855A" strokeWidth={3} dot={{ r: 6, fill: '#2F855A', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="high" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="low" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-6 mt-4 justify-center text-sm text-gray-600">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-agri-600"></div> Current Price</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Expected High</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Expected Low</div>
                    </div>
                </div>

                {/* Crop Price Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {marketTrends.map((crop, idx) => {
                        const changePercent = (((crop.price - crop.low) / crop.low) * 100).toFixed(1);
                        const isUp = changePercent >= 0;

                        return (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">{crop.name}</h3>
                                    <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-md ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {Math.abs(changePercent)}%
                                    </div>
                                </div>

                                <div className="flex items-end gap-1 mb-4">
                                    <span className="text-3xl font-bold text-gray-900">₹{crop.price}</span>
                                    <span className="text-gray-500 mb-1">/kg</span>
                                </div>

                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>24h High</span>
                                        <span className="font-medium text-gray-900">₹{crop.high}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>24h Low</span>
                                        <span className="font-medium text-gray-900">₹{crop.low}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Spoilage Risk</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${crop.spoilageRisk > 15 ? 'bg-red-100 text-red-700' :
                                                crop.spoilageRisk > 8 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {crop.spoilageRisk}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
