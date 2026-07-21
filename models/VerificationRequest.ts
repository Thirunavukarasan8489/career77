import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerificationRequest extends Document {
  companyId: mongoose.Types.ObjectId;
  documentUrl: string;
  documentPublicId?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: mongoose.Types.ObjectId;
  notes?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema = new Schema<IVerificationRequest>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    documentUrl: { type: String, required: true },
    documentPublicId: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VerificationRequestSchema.index({ status: 1 });
VerificationRequestSchema.index({ companyId: 1 });

export const VerificationRequest: Model<IVerificationRequest> =
  mongoose.models.VerificationRequest ||
  mongoose.model<IVerificationRequest>("VerificationRequest", VerificationRequestSchema);
