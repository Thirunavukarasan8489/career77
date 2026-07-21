import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  pipelineStageId?: mongoose.Types.ObjectId;
  status: "Applied" | "Shortlisted" | "Selected" | "Rejected";
  appliedAt: Date;
  resumeUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
    pipelineStageId: { type: Schema.Types.ObjectId, ref: "PipelineStage" },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
      default: "Applied",
    },
    appliedAt: { type: Date, default: Date.now },
    resumeUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

ApplicationSchema.index({ candidateId: 1 });
ApplicationSchema.index({ jobId: 1, status: 1 });
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
