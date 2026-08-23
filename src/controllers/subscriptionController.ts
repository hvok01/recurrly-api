import express from "express";
import Subscription from "../models/subscription.ts";
import { getAuth } from "@clerk/express";
import { parsePositiveInt } from "../utils/utils.ts";

export const getSubscriptionsPaged = async (req: express.Request, res: express.Response) => {
    try {
        const { pageSize, pageCount } = req.query;
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
                subscriptions: subscriptions.map((subscriptionItem) => ({
                    id: subscriptionItem._id,
                    name: subscriptionItem.name,
                    price: subscriptionItem.price,
                    plan: subscriptionItem.plan,
                    billing: subscriptionItem.billing,
                    category: subscriptionItem.category,
                    userId: subscriptionItem.userId,
                    imageUrl: subscriptionItem.imageUrl,
                    status: subscriptionItem.status,
                    startDate: subscriptionItem.startDate,
                    currency: subscriptionItem.currency,
                    renewalDate: subscriptionItem.renewalDate,
                    color: subscriptionItem.color,
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

export const addSubscription = async (req: express.Request & { body: { subscription: any } }, res: express.Response) => {
    try {
        const { name, price, plan, billing, category, imageUrl, status, startDate, currency, renewalDate, color } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
    
        if (!name || !price || !plan || !billing || !category || !imageUrl || !status || !startDate || !currency || !renewalDate || !color) {
            return res.status(400).json({
                success: false,
                message: "Missing fields: please fill all the fields.",
            });
        }
    
        const s = new Subscription({name, price, plan, billing, category, imageUrl, status, startDate, currency, renewalDate, color, userId });
  
        await s.save();

        return res.status(201).json({
            success: true,
            message: "Subscription created successfully.",
            data: {
                subscription: {
                    id: s._id,
                    name: s.name,
                    price: s.price,
                    plan: s.plan,
                    billing: s.billing,
                    category: s.category,
                    userId: s.userId,
                    imageUrl: s.imageUrl,
                    status: s.status,
                    startDate: s.startDate,
                    currency: s.currency,
                    renewalDate: s.renewalDate,
                    color: s.color,
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