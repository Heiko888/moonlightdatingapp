import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReading extends Document {
  userId?: mongoose.Types.ObjectId;
  chartId: mongoose.Types.ObjectId;
  text?: string;
  content?: string;
  sources?: string[];
  pdf?: string;
  createdAt?: Date;
}

const ReadingSchema = new Schema<IReading>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  chartId: { type: Schema.Types.ObjectId, ref: 'Chart', required: true },
  text: String,
  content: { type: String },
  sources: [{ type: String }],
  pdf: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Reading: Model<IReading> = mongoose.models.Reading || mongoose.model<IReading>('Reading', ReadingSchema);
export default Reading;
