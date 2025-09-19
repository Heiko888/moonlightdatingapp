import { Schema, model, models } from 'mongoose';

const ReadingSchema = new Schema({
  chartId: { type: Schema.Types.ObjectId, index: true },
  content: String,            // gerenderter Text (Markdown)
  sources: [String],          // optionale Quellen/Slugs
}, { timestamps: true });

export default models.Reading || model('Reading', ReadingSchema);

