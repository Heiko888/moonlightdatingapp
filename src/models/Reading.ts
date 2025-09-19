import mongoose from 'mongoose';

const ReadingSchema = new mongoose.Schema({
  userId: String,
  result: String,
  createdAt: Date,
});

export default mongoose.models.Reading || mongoose.model('Reading', ReadingSchema);
