import mongoose from "mongoose";

const stoneSchema = new mongoose.Schema({
  stone_details: {
    status: String,
    stoneName: String,
    boughtFrom: String,
    estimatedFeet: Number,
    StoneCost: Number,
    StoneTravelCost: Number,
  },
  cutting_details: {
    cuttingFeet: Number,
    costPerFeet: Number,
  },
  polishing_details: {
    polishFeet: Number,
    costPerFeet: Number,
  },
  stone_type: [
    {
      type: String,
      feet: Number,
      estCost: Number,
      soldCost: Number,
    },
  ],
  stone_sold: {
    markerName: String,
    phoneNo: Number,
  },
});

// ✅ Virtuals for computed fields
stoneSchema.virtual("stone_details.TotalInvestment").get(function () {
  return (this.stone_details.StoneCost || 0) + (this.stone_details.StoneTravelCost || 0);
});

stoneSchema.virtual("cutting_details.TotalCuttingCost").get(function () {
  return (this.cutting_details.cuttingFeet || 0) * (this.cutting_details.costPerFeet || 0);
});

stoneSchema.virtual("polishing_details.TotalPolishCost").get(function () {
  return (this.polishing_details.polishFeet || 0) * (this.polishing_details.costPerFeet || 0);
});

export default mongoose.model("StoneData", stoneSchema);