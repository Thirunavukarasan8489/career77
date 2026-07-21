import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  title: string;
  slug: string;
  companyId?: mongoose.Types.ObjectId;
  recruiterId?: mongoose.Types.ObjectId;
  location: string;
  experience?: string;
  experienceLevel?: string;
  skills: string[];
  description?: string;
  salaryRange?: string;
  employmentType?: string;
  status: "open" | "closed";
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
    location: { type: String, required: true },
    experience: { type: String },
    experienceLevel: { type: String },
    skills: [{ type: String }],
    description: { type: String },
    salaryRange: { type: String },
    employmentType: { type: String, default: "Full-time" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({ location: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ companyId: 1 });
JobSchema.index({ title: "text", description: "text" });

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
