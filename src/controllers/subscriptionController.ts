import express from "express";
import Subscription from "../models/subscription.ts";
import { getAuth } from "@clerk/express";
import { parsePositiveInt } from "../utils/utils.ts";

export const getSubscriptionsPaged = async (req: express.Request & { body: { pageSize: number, pageCount: number, } }, res: express.Response) => {
    try {
        const { pageSize, pageCount } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
    
        if (!pageSize || !pageCount) {
            return res.status(400).json({
                success: false,
                message: "Missing fields: please fill all the fields.",
            });
        }

        const size = Math.min(parsePositiveInt(pageSize, 10), 100);
        const count = parsePositiveInt(pageCount, 1);
        const skip = (count - 1) * size;

        const [subscriptions, total] = await Promise.all([
            Subscription.find({ userId })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(size)
                .lean(),
            Subscription.countDocuments({ userId }),
        ]);

        const totalPages = total === 0 ? 0 : Math.ceil(total / count);

        return res.status(200).json({
            success: true,
            message: "Subscriptions fetched successfully.",
            data: {
                subscriptions: subscriptions.map((s) => ({
                    id: s._id,
                    name: s.name,
                    price: s.price,
                    frecuency: s.frecuency,
                    category: s.category,
                    userId: s.userId,
                })),
                pagination: {
                    pageCount: count,
                    pageSize: size,
                    total,
                    totalPages,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
}

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