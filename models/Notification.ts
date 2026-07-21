import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId;
  candidateId?: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    candidateId: { type: Schema.Types.ObjectId, ref: "Candidate" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ candidateId: 1, read: 1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
