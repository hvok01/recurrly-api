import mongoose, { Document, Schema } from "mongoose";
    
export interface ISubscription extends Document {
    name: string, 
    price: number,
    plan: string,
    billing: string, 
    category: string, 
    userId: string,
    imageUrl: string,
    paymentMethod: string,
    status: string,
    startDate: string,
    currency: string,
    renewalDate: string,
    color: string,
}   

const SubscriptionSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    plan: { type: String, required: true },
    billing: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: { type: String, required: true },
    startDate: { type: String, required: true },
    currency: { type: String, required: true },
    renewalDate: { type: String, required: true },
    color: { type: String, required: false, default: "#f5c542" }
});

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema);