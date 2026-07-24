import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResume {
  url: string;
  publicId: string;
  filename: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

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
  resumes: IResume[];
  savedJobs?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  filename: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
});

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
    resumes: {
      type: [ResumeSchema],
      validate: [
        (val: IResume[]) => val.length <= 3,
        '{PATH} exceeds the limit of 3 resumes'
      ],
      default: []
    },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job", default: [] }],
  },
  { timestamps: true }
);

CandidateSchema.index({ email: 1 });
CandidateSchema.index({ userId: 1 });
CandidateSchema.index({ savedJobs: 1 });

export const Candidate: Model<ICandidate> =
  mongoose.models.Candidate || mongoose.model<ICandidate>("Candidate", CandidateSchema);
