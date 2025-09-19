import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  entry: string;
  createdAt?: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  entry: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);
export default JournalEntry;
