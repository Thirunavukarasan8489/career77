import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPipelineStage extends Document {
  companyId?: mongoose.Types.ObjectId;
  name: string;
  order: number;
}

const PipelineStageSchema = new Schema<IPipelineStage>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    name: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

PipelineStageSchema.index({ companyId: 1, order: 1 });

export const PipelineStage: Model<IPipelineStage> =
  mongoose.models.PipelineStage || mongoose.model<IPipelineStage>("PipelineStage", PipelineStageSchema);
