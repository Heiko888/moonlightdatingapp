import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChart extends Document {
  userId: mongoose.Types.ObjectId;
  type?: string;
  strategy?: string;
  centers?: string[];
  createdAt?: Date;
}

const ChartSchema = new Schema<IChart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: String,
  strategy: String,
  centers: [String],
  createdAt: { type: Date, default: Date.now }
});

const Chart: Model<IChart> = mongoose.models.Chart || mongoose.model<IChart>('Chart', ChartSchema);
export default Chart;
