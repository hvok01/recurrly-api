import express from "express";
import Subscription from "../models/subscription.ts";
import { getAuth } from "@clerk/express";

export const addSubscription = async (req: express.Request & { body: { name: string, price: number, frecuency: string, category: string } }, res: express.Response) => {
    try {
        const { name, price, frecuency, category } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
    
        if (!name || !price || !frecuency || !category) {
            return res.status(400).json({
                success: false,
                message: "Missing fields: please fill all the fields.",
            });
        }
    
        const subscriptionDoc = new Subscription({
            name,
            price,
            frecuency,
            category,
            userId
        });
  
        await subscriptionDoc.save();

        return res.status(201).json({
            success: true,
            message: "Subscription created successfully.",
            data: {
                subscription: {
                    id: subscriptionDoc._id,
                    name: subscriptionDoc.name,
                    price: subscriptionDoc.price,
                    category: subscriptionDoc.category,
                    userId: subscriptionDoc.userId,
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};