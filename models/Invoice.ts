import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoice extends Document {
  companyId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["paid", "pending", "failed"], default: "paid" },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

InvoiceSchema.index({ companyId: 1, issuedAt: -1 });

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
