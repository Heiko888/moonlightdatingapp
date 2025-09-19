import mongoose from 'mongoose';

const ChartSchema = new mongoose.Schema({
  userId: String,
  chartData: Object,
  createdAt: Date,
});

export default mongoose.models.Chart || mongoose.model('Chart', ChartSchema);
