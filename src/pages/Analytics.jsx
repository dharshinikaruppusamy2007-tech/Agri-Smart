import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

export default function Analytics() {
    const profitData = [
        { month: 'Jan', profit: 12000, loss: 2000 },
        { month: 'Feb', profit: 15000, loss: 1500 },
        { month: 'Mar', profit: 18000, loss: 1200 },
        { month: 'Apr', profit: 14000, loss: 2500 },
        { month: 'May', profit: 22000, loss: 1000 },
        { month: 'Jun', profit: 25000, loss: 800 },
    ];

    const efficiencyData = [
        { metric: 'Storage', score: 85 },
        { metric: 'Transport', score: 72 },
        { metric: 'Sales', score: 90 },
        { metric: 'Loss Red.', score: 78 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-agri-600" />
                    Performance Analytics
                </h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Total Savings</div>
                        <div className="text-2xl font-bold text-agri-700 flex items-center gap-2">
                            ₹ 45,200
                            <span className="text-xs bg-agri-100 text-agri-700 px-2 py-1 rounded-full flex items-center gap-1">
                                <ArrowUpRight size={12} /> 12%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Loss Reduction</div>
                        <div className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                            18.5%
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                                <ArrowDownRight size={12} /> risk
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Storage Efficiency</div>
                        <div className="text-2xl font-bold text-orange-700">92/100</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Net Margin</div>
                        <div className="text-2xl font-bold text-purple-700">32%</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profit Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Profit Trend</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={profitData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Efficiency Scores */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Efficiency Scores</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={efficiencyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="metric" axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
