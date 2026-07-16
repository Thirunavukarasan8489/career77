import mongoose, { Schema, model, models } from "mongoose";

export interface IJob {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  slug: string;
  location: string;
  experience?: string;
  skills: string[];
  description?: string;
  status: "open" | "closed";
  postedAt: Date;
  recruiterId?: mongoose.Types.ObjectId | string;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  experience: { type: String },
  skills: [{ type: String }],
  description: { type: String },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  postedAt: { type: Date, default: Date.now },
  recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
});

// Indexes per Section 9
JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({ location: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ title: "text", description: "text" });

export const Job = models.Job || model<IJob>("Job", JobSchema);
