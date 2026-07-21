import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecruiter extends Document {
  userId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  password?: string;
  companyName?: string;
  designation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterSchema = new Schema<IRecruiter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    name: { type: String },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String },
    companyName: { type: String },
    designation: { type: String },
  },
  { timestamps: true }
);

RecruiterSchema.index({ email: 1 });
RecruiterSchema.index({ userId: 1 });
RecruiterSchema.index({ companyId: 1 });

export const Recruiter: Model<IRecruiter> =
  mongoose.models.Recruiter || mongoose.model<IRecruiter>("Recruiter", RecruiterSchema);
