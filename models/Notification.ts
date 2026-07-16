import mongoose, { Schema, model, models } from "mongoose";

export interface INotification {
  _id: mongoose.Types.ObjectId | string;
  candidateId: mongoose.Types.ObjectId | string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ candidateId: 1, read: 1 });

export const Notification = models.Notification || model<INotification>("Notification", NotificationSchema);
