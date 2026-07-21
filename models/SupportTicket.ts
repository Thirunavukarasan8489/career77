import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupportResponse {
  responderId: mongoose.Types.ObjectId;
  responderRole: "candidate" | "recruiter" | "superadmin";
  message: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  raisedBy: mongoose.Types.ObjectId;
  userRole: "candidate" | "recruiter";
  subject: string;
  message: string;
  category?: string;
  status: "open" | "in_progress" | "resolved";
  responses: ISupportResponse[];
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userRole: { type: String, enum: ["candidate", "recruiter"], required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, default: "General" },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    responses: [
      {
        responderId: { type: Schema.Types.ObjectId, ref: "User" },
        responderRole: { type: String, enum: ["candidate", "recruiter", "superadmin"] },
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

SupportTicketSchema.index({ raisedBy: 1, status: 1 });

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
