import mongoose from "mongoose";

const stoneSchema = new mongoose.Schema({
  // --- Stone Details ---
  status: String,
  stoneName: String,
  date: Date,
  boughtFrom: String,
  estimatedFeet: Number,
  finalFeet: Number,
  stoneCost: Number,
  soldAmount: Number,
  stoneTravelCost: Number,

  // --- Main Type Category ---
  mainType: String,

  // --- Cutting Details ---
  cuttingFeet: Number,
  cuttingCostPerFeet: Number,

  // --- Polishing Details ---
  polishFeet: Number,
  polishCostPerFeet: Number,

  // --- Totals (provided by UI) ---
  totalInvestment: Number,
  totalCuttingCost: Number,
  totalPolishCost: Number,

  // --- Aggregates & Extras ---
  extraAmountSpent: Number, // any extra expenses
  extraAmountReason: String,
  totalSoldAmount: Number,

  // Multiple extra expenses
  extras: [
    {
      amount: { type: Number, default: 0 },
      reason: { type: String, default: '' },
    }
  ],

  // --- Stone Type Array ---
  stoneTypes: [
    {
      type: { type: String, required: true },
      feet: { type: Number, default: 0 },
      estCost: { type: Number, default: 0 },
      soldCost: { type: Number, default: 0 },
    }
  ],

  // --- Sold Info ---
  markerName: String,
  phoneNo: Number,
});

// Totals are now stored fields supplied by the UI

export default mongoose.model("StoneData", stoneSchema);
