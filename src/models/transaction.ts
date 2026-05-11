import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  description: string;
  user: string;
}

const TransactionSchema: Schema = new Schema({
  description: { type: String, required: true },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
