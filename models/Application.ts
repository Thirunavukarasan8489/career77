import mongoose, { Schema, model, models } from "mongoose";

export interface IApplication {
  _id: mongoose.Types.ObjectId | string;
  jobId: mongoose.Types.ObjectId | string;
  candidateId: mongoose.Types.ObjectId | string;
  status: "Applied" | "Shortlisted" | "Selected" | "Rejected";
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
});

ApplicationSchema.index({ candidateId: 1 });
ApplicationSchema.index({ jobId: 1, status: 1 });
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true }); // no duplicate applies

export const Application = models.Application || model<IApplication>("Application", ApplicationSchema);
