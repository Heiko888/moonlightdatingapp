import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdmin extends Document {
	username: string;
	email: string;
	password: string;
	createdAt?: Date;
	comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

AdminSchema.pre('save', async function (next) {
	const doc = this as IAdmin;
	// @ts-ignore
	if (!(doc as any).isModified('password')) return next();
	doc.password = await bcrypt.hash(doc.password, 10);
	next();
});

AdminSchema.methods.comparePassword = function (candidate: string) {
	const doc = this as IAdmin;
	return bcrypt.compare(candidate, doc.password);
};

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
