import { Schema } from "mongoose";

export const OfflineDiscountSchema = new Schema(
    {
        category: { type: String, required: true },
        offerTitle: { type: String, required: true },
        offerDescription: { type: String, required: true },
        originalPrice: { type: Number, default: 0 },
        discountValue: { type: Number, default: 0 },
        discountPercent: { type: Number, default: 0 },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        validUpto: { type: Date },
    },
    { _id: true }
);
