import mongoose, { Schema, model, models } from "mongoose";

export interface IRecruiter {
  _id: mongoose.Types.ObjectId | string;
  email: string;
  password?: string; // Hashed password
  companyName?: string;
}

const RecruiterSchema = new Schema<IRecruiter>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
});

export const Recruiter = models.Recruiter || model<IRecruiter>("Recruiter", RecruiterSchema);
