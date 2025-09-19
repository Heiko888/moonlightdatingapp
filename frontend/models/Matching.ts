import mongoose, { Schema, models } from "mongoose";

const MatchingSchema = new Schema({
  userId: { type: String, required: true },
  coachId: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default models.Matching || mongoose.model("Matching", MatchingSchema);
