import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICandidate extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  mobile?: string;
  experience?: string;
  city?: string;
  skills: string[];
  lookingFor?: string;
  bio?: string;
  resumeUrl?: string;
  resumePublicId?: string;
  savedJobs?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String },
    experience: { type: String },
    city: { type: String },
    skills: [{ type: String }],
    lookingFor: { type: String },
    bio: { type: String },
    resumeUrl: { type: String },
    resumePublicId: { type: String },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job", default: [] }],
  },
  { timestamps: true }
);

CandidateSchema.index({ email: 1 });
CandidateSchema.index({ userId: 1 });
CandidateSchema.index({ savedJobs: 1 });

export const Candidate: Model<ICandidate> =
  mongoose.models.Candidate || mongoose.model<ICandidate>("Candidate", CandidateSchema);
