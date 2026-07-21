import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICmsContent extends Document {
  key: string;
  content: any;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CmsContentSchema = new Schema<ICmsContent>(
  {
    key: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


export const CmsContent: Model<ICmsContent> =
  mongoose.models.CmsContent || mongoose.model<ICmsContent>("CmsContent", CmsContentSchema);
