import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  role: "candidate" | "recruiter" | "superadmin";
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ["candidate", "recruiter", "superadmin"], required: true },
    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);


export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
