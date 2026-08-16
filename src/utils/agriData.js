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
    const { crop, quantity, productionCost, capacity, storageCostPerKg, transportCostPerKm, distance } = inputs;

    const cropInfo = CROP_DATA[crop] || { spoilageRisk: 15, marketPrice: 0 };
    const qty = parseFloat(quantity) || 0;

    // Storage Logic
    const ownStorageUsed = Math.min(qty, parseFloat(capacity) || 0);
    const excessStorage = Math.max(0, qty - (parseFloat(capacity) || 0));
    const storageCost = excessStorage * (parseFloat(storageCostPerKg) || 0); // Cost applies to excess only? 
    // User prompt: "Storage Cost per kg (₹)" and "Input: Available Storage Capacity".
    // Let's assume Storage Cost per Kg is for *rented* storage for the excess.

    // Transport Logic
    // Assuming 1 trip for standard truck (10 tons). If quantity > 10000, multiple trips?
    // User prompt: "Transport Cost per km (₹)".
    // If user enters "50/km", it's likely for the whole load if small, or per truck.
    // Let's assume the cost provided IS the total transport cost per km for the entire shipment 
    // (simplified, or user calculates it: "Rent a truck for ₹30/km").
    const transCost = (parseFloat(distance) || 0) * (parseFloat(transportCostPerKm) || 0);

    // Spoilage
    // Risk based on crop type + time?
    // Prompt: "Calculates spoilage if storage exceeds capacity".
    // If excess storage > 0, spoilage risk increases?
    // Let's apply base risk. If excess > 0, add penalty risk if not stored properly?
    // But we utilize "Storage Cost" so we assume it IS stored properly in rented space.
    // Let's treat "Spoilage Risk Percentage" as the intrinsic risk + 5% if excess exist?
    let risk = cropInfo.spoilageRisk;
    if (excessStorage > 0) risk += 5; // Penalty for logic
    const spoilageLossQty = qty * (risk / 100);
    const spoilageLossValue = spoilageLossQty * cropInfo.marketPrice;

    // Financials
    const totalProductionCost = parseFloat(productionCost) || 0; // User inputs TOTAL cost or per kg? "Cost of Production (₹)" - usually Total.
    // But if user inputs 20000, and quantity is 1000, cost is 20/kg.

    const totalCost = totalProductionCost + storageCost + transCost;
    const unitCost = qty > 0 ? totalCost / qty : 0;

    // Pricing
    const marketPrice = cropInfo.marketPrice;
    const recommendedPrice = Math.max(marketPrice, unitCost * 1.3); // Ensure 30% margin or Market Price

    // Revenue & Profit
    const effectiveQty = qty - spoilageLossQty; // Sellable
    const revenue = effectiveQty * recommendedPrice;
    const netProfit = revenue - totalCost;

    // Allocations
    const emergencyBuffer = netProfit > 0 ? netProfit * 0.05 : 0;
    const savings = netProfit > 0 ? netProfit * 0.20 : 0;

    return {
        ownStorageUsed,
        excessStorage,
        storageCost,
        transCost,
        spoilageRisk: risk,
        spoilageLossValue,
        totalCost,
        recommendedPrice,
        netProfit,
        emergencyBuffer,
        savings,
        marketPrice
    };
};
