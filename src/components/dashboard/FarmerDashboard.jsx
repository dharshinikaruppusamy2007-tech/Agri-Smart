import React, { useState, useEffect } from 'react';
import { CROP_DATA, calculateAgriStats } from '../../utils/agriData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, Truck, Warehouse, IndianRupee, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

export default function FarmerDashboard() {
    const { user, harvestInputs, setHarvestInputs } = useAuth(); // Get user and shared state from context

    // Default initial inputs if not set
    const inputs = harvestInputs || {
        crop: 'Wheat',
        quantity: '1000',
        productionCost: '15000',
        capacity: '800',
        storageCostPerKg: '2',
        transportCostPerKm: '25',
        distance: '50',
        recommendedPrice: '24'
    };

    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Only set default to context once if not available
        if (!harvestInputs) {
            setHarvestInputs(inputs);
        }

        const results = calculateAgriStats(inputs);
        setStats(results);
    }, [inputs, harvestInputs, setHarvestInputs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHarvestInputs(prev => ({ ...prev, [name]: value }));
    };

    const generatePDF = () => {
        if (!stats) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(47, 133, 90); // Green
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("AgriSmart Supply Chain Report", 105, 25, null, null, "center");

        // Farmer Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Farmer: ${user?.name || 'N/A'}`, 14, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 56);
        doc.text(`Crop: ${inputs.crop}`, 14, 62);

        // Financial Breakdown Table
        doc.autoTable({
            startY: 70,
            head: [['Category', 'Value (INR)']],
            body: [
                ['Production Cost', `Rs. ${inputs.productionCost}`],
                ['Storage Cost', `Rs. ${stats.storageCost.toFixed(2)}`],
                ['Transport Cost', `Rs. ${stats.transCost.toFixed(2)}`],
                ['Total Cost', `Rs. ${stats.totalCost.toFixed(2)}`],
                ['Projected Revenue', `Rs. ${(stats.netProfit + stats.totalCost).toFixed(2)}`],
                ['Net Profit', `Rs. ${stats.netProfit.toFixed(2)}`],
            ],
            theme: 'grid',
            headStyles: { fillColor: [47, 133, 90] }
        });

        // Allocations
        doc.text("Smart Allocations", 14, doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Allocation', 'Amount (INR)']],
            body: [
                ['Emergency Buffer (5%)', `Rs. ${stats.emergencyBuffer.toFixed(2)}`],
                ['Suggested Savings (20%)', `Rs. ${stats.savings.toFixed(2)}`],
                ['Re-investment Fund', `Rs. ${(stats.netProfit - stats.emergencyBuffer - stats.savings).toFixed(2)}`],
            ],
            theme: 'striped',
        });

        // Logistics
        doc.text("Logistics & Storage Plan", 14, doc.lastAutoTable.finalY + 15);
        doc.setFontSize(10);
        doc.text(`- Own Storage Used: ${stats.ownStorageUsed} kg`, 14, doc.lastAutoTable.finalY + 22);
        doc.text(`- External Storage Needed: ${stats.excessStorage} kg`, 14, doc.lastAutoTable.finalY + 28);
        doc.text(`- Spoilage Risk: ${stats.spoilageRisk}%`, 14, doc.lastAutoTable.finalY + 34);
        doc.text(`- Recommended Selling Price: Rs. ${stats.recommendedPrice.toFixed(2)} / kg`, 14, doc.lastAutoTable.finalY + 40);

        doc.save('AgriSmart_Plan.pdf');
    };

    const chartData = stats ? [
        { name: 'Production', value: parseFloat(inputs.productionCost) || 0, color: '#F59E0B' }, // Amber
        { name: 'Storage', value: stats.storageCost, color: '#3B82F6' }, // Blue
        { name: 'Transport', value: stats.transCost, color: '#EF4444' }, // Red
        { name: 'Profit', value: Math.max(0, stats.netProfit), color: '#10B981' }, // Green
    ] : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Warehouse className="text-agri-600" size={20} />
                        Harvest Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Crop Type</label>
                            <select name="crop" value={inputs.crop} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500">
                                {Object.keys(CROP_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Quantity (kg)</label>
                                <input type="number" name="quantity" value={inputs.quantity} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Prod. Cost (Rs)</label>
                                <input type="number" name="productionCost" value={inputs.productionCost} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Storage Cap (kg)</label>
                                <input type="number" name="capacity" value={inputs.capacity} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Stor. Cost/kg</label>
                                <input type="number" name="storageCostPerKg" value={inputs.storageCostPerKg} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Trans. Cost/km</label>
                                <input type="number" name="transportCostPerKm" value={inputs.transportCostPerKm} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Distance (km)</label>
                                <input type="number" name="distance" value={inputs.distance} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Recommended Price (Rs/kg)</label>
                                <input type="number" name="recommendedPrice" value={inputs.recommendedPrice} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-agri-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={generatePDF}
                    className="w-full bg-agri-800 text-white py-3 rounded-xl font-bold hover:bg-agri-900 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <Download size={20} /> Download PDF Report
                </button>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-2 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-agri-500">
                        <div className="text-sm text-gray-500 mb-1">Net Profit Prediction</div>
                        <div className={`text-2xl font-bold ${stats?.netProfit >= 0 ? 'text-agri-700' : 'text-red-600'}`}>
                            ₹ {stats?.netProfit.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Based on current market rates</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <div className="text-sm text-gray-500 mb-1">Recommended Price</div>
                        <div className="text-2xl font-bold text-gray-800">
                            ₹ {stats?.recommendedPrice.toFixed(2)} <span className="text-sm font-normal text-gray-500">/kg</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Market Avg: ₹{stats?.marketPrice}</div>
                    </div>
                    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${stats?.excessStorage > 0 ? 'border-orange-500' : 'border-gray-300'}`}>
                        <div className="text-sm text-gray-500 mb-1">Excess Crop Risk</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {stats?.excessStorage} <span className="text-sm font-normal">kg</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            {stats?.spoilageRisk}% Spoilage Chance {stats?.excessStorage > 0 && <AlertTriangle size={12} className="text-orange-500" />}
                        </div>
                    </div>
                </div>

                {/* Charts & Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Financial Breakdown</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value) => [`₹${value.toFixed(0)}`, 'Amount']} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500">Own Storage</div>
                            <div className="font-bold text-gray-800">{stats?.ownStorageUsed} kg</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <div className="text-xs text-orange-600">Ext. Storage</div>
                            <div className="font-bold text-orange-700">{stats?.excessStorage} kg</div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <div className="text-xs text-red-600">Est. Loss</div>
                            <div className="font-bold text-red-700">₹{stats?.spoilageLossValue.toFixed(0)}</div>
                        </div>
                        <div className="p-3 bg-agri-50 rounded-lg">
                            <div className="text-xs text-agri-600">Savings Fund</div>
                            <div className="font-bold text-agri-700">₹{stats?.savings.toFixed(0)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
