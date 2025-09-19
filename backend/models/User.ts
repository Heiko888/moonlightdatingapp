import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string; email: string; password: string;
  name?: string; birthdate?: string; birthplace?: string;
  hdType?: string; profile?: string;
  centers?: string[]; channels?: string[]; gates?: string[]; planets?: string[];
  chart?: Record<string, unknown>; avatar?: string; createdAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: String, birthdate: String, birthplace: String,
  hdType: String, profile: String,
  centers: [String], channels: [String], gates: [String], planets: [String],
  chart: Object, avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  const doc = this as IUser;
  // @ts-ignore
  if (!(doc as any).isModified('password')) return next();
  doc.password = await bcrypt.hash(doc.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  const doc = this as IUser;
  return bcrypt.compare(candidate, doc.password);
};

// Reuse im Dev-Mode vermeiden OverwriteModelError
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
