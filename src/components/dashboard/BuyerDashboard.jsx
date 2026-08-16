import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

const MOCK_MARKET_CROPS = [
    { id: 1, crop: 'Wheat', farmer: 'Ramesh Kumar', quantity: '500 kg', price: 28, location: 'Punjab', quality: 'Grade A' },
    { id: 2, crop: 'Rice', farmer: 'Suresh Patil', quantity: '1200 kg', price: 42, location: 'Maharashtra', quality: 'Premimum' },
    { id: 3, crop: 'Tomato', farmer: 'Abdul Khan', quantity: '200 kg', price: 35, location: 'Karnataka', quality: 'Fresh' },
    { id: 4, crop: 'Potato', farmer: 'Deepak Singh', quantity: '2000 kg', price: 18, location: 'UP', quality: 'Standard' },
    { id: 5, crop: 'Wheat', farmer: 'Harjeet Singh', quantity: '800 kg', price: 27, location: 'Punjab', quality: 'Grade B' },
];

export default function BuyerDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);

    const handleOrder = (crop) => {
        const newOrder = {
            ...crop,
            orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
            status: 'Processing',
            date: new Date().toLocaleDateString()
        };
        setOrders([newOrder, ...orders]);
        alert(`Order placed for ${crop.crop} from ${crop.farmer}!`);
    };

    const filteredCrops = MOCK_MARKET_CROPS.filter(c =>
        c.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Active Deliveries</div>
                    <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'Processing').length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Total Spent</div>
                    <div className="text-2xl font-bold text-agri-600">
                        ₹ {orders.reduce((acc, curr) => acc + (curr.price * parseInt(curr.quantity)), 0).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Marketplace */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
                            <span>Live Market</span>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search crops or location..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-agri-500 focus:border-agri-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </h3>

                        <div className="space-y-4">
                            {filteredCrops.map((crop) => (
                                <div key={crop.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg">{crop.crop}</h4>
                                            <p className="text-sm text-gray-500">Farmer: {crop.farmer} • {crop.location}</p>
                                            <div className="mt-2 flex gap-2">
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{crop.quality}</span>
                                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{crop.quantity} Available</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-agri-700">₹{crop.price}<span className="text-sm text-gray-500 font-normal">/kg</span></div>
                                            <button
                                                onClick={() => handleOrder(crop)}
                                                className="mt-3 bg-agri-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-agri-700 transition-colors flex items-center gap-2"
                                            >
                                                <ShoppingCart size={16} /> Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Orders</h3>
                        {orders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No active orders.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, idx) => (
                                    <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-gray-800">{order.crop}</span>
                                            <span className="text-sm text-gray-500">{order.date}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">ID: {order.orderId}</div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-bold text-agri-600">₹{order.price * parseInt(order.quantity)}</span>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Truck size={12} /> {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
