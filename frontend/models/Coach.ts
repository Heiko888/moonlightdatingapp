import mongoose, { Schema, models } from "mongoose";

const CoachSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  specialties: [{ type: String }],
  reviews: [{
    userId: { type: String },
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default models.Coach || mongoose.model("Coach", CoachSchema);
