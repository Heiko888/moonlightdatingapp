
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISwipe extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  liked: boolean;
  createdAt?: Date;
}

const SwipeSchema = new Schema<ISwipe>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  liked: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Swipe: Model<ISwipe> = mongoose.models.Swipe || mongoose.model<ISwipe>('Swipe', SwipeSchema);
export default Swipe;
