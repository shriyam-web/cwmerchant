import { Schema } from "mongoose";

export const ProductRatingSchema = new Schema(
    {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, required: true },
        merchantReply: { type: String },
        isLike: { type: Boolean, default: false },
        certifiedBuyer: { type: Boolean, default: true },
    },
    { _id: false, timestamps: true }
);
