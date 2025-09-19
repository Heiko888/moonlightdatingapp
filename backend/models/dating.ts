import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDating extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const DatingSchema = new Schema<IDating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true, collection: 'dating' }
);

// Optional: Doppelanfragen verhindern
DatingSchema.index({ userId: 1, targetId: 1 }, { unique: true });

const Dating: Model<IDating> =
  mongoose.models.Dating || mongoose.model<IDating>('Dating', DatingSchema);

export default Dating;