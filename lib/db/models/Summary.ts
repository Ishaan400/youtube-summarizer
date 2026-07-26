import mongoose, { Schema, Model, Types } from 'mongoose';

export interface ISummary {
  userId: Types.ObjectId;
  url: string;
  summary: string;
  createdAt: Date;
}

const summarySchema = new Schema<ISummary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Summary: Model<ISummary> =
  mongoose.models.Summary ?? mongoose.model<ISummary>('Summary', summarySchema);

export default Summary;
