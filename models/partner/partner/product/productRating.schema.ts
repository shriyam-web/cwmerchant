import { Schema } from "mongoose";
import { IProductRating } from "./product.interface";

export const ProductRatingSchema = new Schema<IProductRating>(
    {
        userId: { type: String, },
        userName: { type: String, },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String, },
        merchantReply: { type: String },
        isLike: { type: Boolean, default: false },
        certifiedBuyer: { type: Boolean, default: true },
    },
    { _id: false, timestamps: true }
);
