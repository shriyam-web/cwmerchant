import mongoose, { Schema, Document, Model } from "mongoose";

// 1. TypeScript interface for Admin
export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
}

// 2. Define Schema
const AdminSchema: Schema<IAdmin> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 3. Use type assertion to avoid union type error
const Admin: Model<IAdmin> =
  (mongoose.models.Admin as Model<IAdmin>) ||
  mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
