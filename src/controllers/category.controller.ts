import express from "express";
import { getAuth } from "@clerk/express";
import { parsePositiveInt } from "../utils/utils.ts";
import Category from "../models/category.ts";

export const getCategoriesPaged = async (req: express.Request & { body: { pageSize: number, pageCount: number, } }, res: express.Response) => {
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

        const [categories, total] = await Promise.all([
            Category.find({ userId })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(size)
                .lean(),
            Category.countDocuments({ userId }),
        ]);

        const totalPages = total === 0 ? 0 : Math.ceil(total / count);

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully.",
            data: {
                categories: categories.map((s) => ({
                    id: s._id,
                    name: s.name,
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

export const addCategory = async (req: express.Request & { body: { name: string } }, res: express.Response) => {
    try {
        const { name } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
    
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Missing fields: please fill all the fields.",
            });
        }
    
        const categoryDoc = new Category({
            name,
            userId
        });
  
        await categoryDoc.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: {
                category: {
                    id: categoryDoc._id,
                    name: categoryDoc.name,
                    userId: categoryDoc.userId,
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

export const updateCateogory = async (req: express.Request & { body: { id: string, name: string } }, res: express.Response) => {
    try {
        const { id, name } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
    
        if (!name || !id) {
            return res.status(400).json({
                success: false,
                message: "Missing fields: please fill all the fields.",
            });
        }

        const updatedCategoryDoc = await Category.findOneAndUpdate({ _id: id }, {
            name,
            userId
        });

        if (updatedCategoryDoc) {

            return res.status(201).json({
                success: true,
                message: "Category created successfully.",
                data: {
                    category: {
                        id: updatedCategoryDoc._id,
                        name: updatedCategoryDoc.name,
                        userId: updatedCategoryDoc.userId,
                    }
                }
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Unable to update the selected category.",
                data: null
            });

        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};