import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChat extends Document {
  users: mongoose.Types.ObjectId[];
  createdAt?: Date;
}

const ChatSchema = new Schema<IChat>({
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now }
});

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
export default Chat;
