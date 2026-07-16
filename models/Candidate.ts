import mongoose, { Schema, model, models } from "mongoose";

export interface ICandidate {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  mobile: string;
  email?: string;
  experience?: string;
  city?: string;
  skills: string[];
  lookingFor: string;
  resumeUrl?: string; // Cloudinary secure_url
  resumePublicId?: string; // Cloudinary public_id
}

const CandidateSchema = new Schema<ICandidate>({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  experience: { type: String },
  city: { type: String },
  skills: [{ type: String }],
  lookingFor: { type: String, required: true },
  resumeUrl: { type: String },
  resumePublicId: { type: String },
});

export const Candidate = models.Candidate || model<ICandidate>("Candidate", CandidateSchema);
