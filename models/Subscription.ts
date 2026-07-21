import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  companyId: mongoose.Types.ObjectId;
  plan: "Free" | "Starter" | "Enterprise";
  status: "active" | "past_due" | "cancelled";
  renewsAt?: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    plan: { type: String, enum: ["Free", "Starter", "Enterprise"], default: "Free" },
    status: { type: String, enum: ["active", "past_due", "cancelled"], default: "active" },
    renewsAt: { type: Date },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ companyId: 1 });

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
