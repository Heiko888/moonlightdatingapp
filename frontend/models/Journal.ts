import mongoose, { Schema, Document } from 'mongoose';

export interface IJournal extends Document {
  userId: string;
  entry: string;
  category: string;
  date: Date;
}

const JournalSchema: Schema = new Schema({
  userId: { type: String, required: true },
  entry: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true }
});

export default mongoose.models.Journal || mongoose.model<IJournal>('Journal', JournalSchema);
