import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  slug: string;
  logoUrl?: string;
  logoPublicId?: string;
  about?: string;
  website?: string;
  location?: string;
  industry?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logoUrl: { type: String },
    logoPublicId: { type: String },
    about: { type: String },
    website: { type: String },
    location: { type: String },
    industry: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CompanySchema.index({ verified: 1 });

export const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
