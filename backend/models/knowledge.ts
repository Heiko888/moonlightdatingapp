import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledge extends Document {
	title: string;
	description?: string;
	category?: string;
	items?: mongoose.Types.ObjectId[];
	createdAt?: Date;
	updatedAt?: Date;
}

const KnowledgeSchema = new Schema<IKnowledge>({
	title: { type: String, required: true },
	description: { type: String },
	category: { type: String, default: 'Allgemein' },
	items: [{ type: Schema.Types.ObjectId, ref: 'KnowledgeItem' }],
}, { timestamps: true });

const Knowledge: Model<IKnowledge> = mongoose.models.Knowledge || mongoose.model<IKnowledge>('Knowledge', KnowledgeSchema);
export default Knowledge;
