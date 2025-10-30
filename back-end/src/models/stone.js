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

// ✅ Virtuals for Computed Fields
stoneSchema.virtual("totalInvestment").get(function () {
  return (this.stoneCost || 0) + (this.stoneTravelCost || 0);
});

stoneSchema.virtual("totalCuttingCost").get(function () {
  return (this.cuttingFeet || 0) * (this.cuttingCostPerFeet || 0);
});

stoneSchema.virtual("totalPolishCost").get(function () {
  return (this.polishFeet || 0) * (this.polishCostPerFeet || 0);
});

export default mongoose.model("StoneData", stoneSchema);
