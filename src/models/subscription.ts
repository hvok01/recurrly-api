import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
    name: string, 
    price: number, 
    frecuency: string, 
    category: string, 
    userId: string,
}

const SubscriptionSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, defaul: 0 },
    frecuency: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: String, required: true },
});

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema);