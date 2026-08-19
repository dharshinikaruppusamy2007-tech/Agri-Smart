export const CROP_DATA = {
    Wheat: { spoilageRisk: 5, marketPrice: 24, low: 21, high: 28 },
    Rice: { spoilageRisk: 8, marketPrice: 35, low: 30, high: 42 },
    Tomato: { spoilageRisk: 25, marketPrice: 40, low: 15, high: 60 },
    Potato: { spoilageRisk: 10, marketPrice: 18, low: 12, high: 25 },
    Onion: { spoilageRisk: 15, marketPrice: 25, low: 10, high: 50 },
    Maize: { spoilageRisk: 7, marketPrice: 22, low: 18, high: 26 },
    Cotton: { spoilageRisk: 3, marketPrice: 60, low: 50, high: 75 },
    Sugarcane: { spoilageRisk: 12, marketPrice: 0.3, low: 0.25, high: 0.35 }, // Per kg? usually per ton. Let's assume input is KG. 300 per ton -> 0.3 per kg? reliable price is ~3000/ton -> 3/kg.
    Soybean: { spoilageRisk: 6, marketPrice: 45, low: 38, high: 52 },
};

// Ensure Sugarcane price is realistic. MSP is around ₹315/quintal => ₹3.15/kg.
CROP_DATA.Sugarcane.marketPrice = 3.5;
CROP_DATA.Sugarcane.low = 3.0;
CROP_DATA.Sugarcane.high = 4.0;

export const calculateAgriStats = (inputs) => {
    const { crop, quantity, productionCost, capacity, storageCostPerKg, transportCostPerKm, distance, recommendedPrice: recPriceInput } = inputs;

    const cropInfo = CROP_DATA[crop] || { spoilageRisk: 15, marketPrice: 0 };
    const qty = parseFloat(quantity) || 0;
    const capacityVal = parseFloat(capacity) || 0;

    // Revenue
    const recommendedPrice = parseFloat(recPriceInput) || 24;
    const revenue = qty * recommendedPrice;

    // Costs
    const prodCostVal = parseFloat(productionCost) || 0;

    // Use Math.min so we don't charge for empty capacity space if qty < capacity, 
    // but caps at capacity for storage cost.
    const storedQty = Math.min(qty, capacityVal);
    const storageCost = storedQty * (parseFloat(storageCostPerKg) || 0);

    const transCost = (parseFloat(distance) || 0) * (parseFloat(transportCostPerKm) || 0);

    const totalCost = prodCostVal + storageCost + transCost;

    // Profit
    const netProfit = revenue - totalCost;

    // Excess Crop
    const excessStorage = Math.max(0, qty - capacityVal);
    const ownStorageUsed = storedQty;

    // Others
    const emergencyBuffer = netProfit > 0 ? netProfit * 0.05 : 0;
    const savings = netProfit > 0 ? netProfit * 0.20 : 0;
    const spoilageLossValue = excessStorage * (cropInfo.marketPrice || 24); // mock spoilage loss if needed

    return {
        revenue,
        ownStorageUsed,
        excessStorage,
        storageCost,
        transCost,
        spoilageRisk: cropInfo.spoilageRisk,
        spoilageLossValue,
        totalCost,
        recommendedPrice,
        netProfit,
        emergencyBuffer,
        savings,
        marketPrice: cropInfo.marketPrice
    };
};
