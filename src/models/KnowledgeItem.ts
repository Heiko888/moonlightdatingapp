import mongoose, { Document, Model } from 'mongoose';

export interface IKnowledgeItem extends Document {
  scope: 'business' | 'health' | 'relationship' | 'private' | 'all';
  type: string;
  refKey?: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const KnowledgeItemSchema = new mongoose.Schema({
  scope: { type: String, enum: ['business','health','relationship','private','all'], default: 'all' },
  type: { type: String, default: 'general' },
  refKey: String,
  content: String
}, { timestamps: true });

export default (mongoose.models.KnowledgeItem as Model<IKnowledgeItem>)
  || mongoose.model<IKnowledgeItem>('KnowledgeItem', KnowledgeItemSchema);
