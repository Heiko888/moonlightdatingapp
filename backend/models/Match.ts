import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMatch extends Document {
  userA: mongoose.Types.ObjectId;
  userB: mongoose.Types.ObjectId;
  createdAt?: Date;
}

const MatchSchema = new Schema<IMatch>({
  userA: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userB: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Match: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
export default Match;
