import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledgeItem extends Document {
  title: string;
  slug?: string;
  category?: string;
  module?: string;
  content: string;
  bodyMarkdown?: string;
  bodyHtml?: string;
  fileUrl?: string;
  sourcePath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const KnowledgeItemSchema = new Schema<IKnowledgeItem>({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  category: { type: String, default: 'Allgemein' },
  module: { type: String },
  content: { type: String, required: true },
  bodyMarkdown: { type: String },
  bodyHtml: { type: String },
  fileUrl: { type: String },
  sourcePath: { type: String },
}, { timestamps: true });

KnowledgeItemSchema.index({ slug: 1 });
KnowledgeItemSchema.index({ title: 1 });

const KnowledgeItem: Model<IKnowledgeItem> = mongoose.models.KnowledgeItem || mongoose.model<IKnowledgeItem>('KnowledgeItem', KnowledgeItemSchema);
export default KnowledgeItem;
