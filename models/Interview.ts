import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInterview extends Document {
  applicationId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  mode: "video" | "phone" | "in-person";
  link?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: "Application", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    scheduledAt: { type: Date, required: true },
    mode: { type: String, enum: ["video", "phone", "in-person"], default: "video" },
    link: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  },
  { timestamps: true }
);

InterviewSchema.index({ candidateId: 1, scheduledAt: 1 });
InterviewSchema.index({ recruiterId: 1, scheduledAt: 1 });

export const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>("Interview", InterviewSchema);
