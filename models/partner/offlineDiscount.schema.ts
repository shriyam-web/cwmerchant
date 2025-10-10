import { Schema } from "mongoose";

export const OfflineDiscountSchema = new Schema(
    {
        category: { type: String, required: true },
        offerTitle: { type: String, required: true },
        offerDescription: { type: String, required: true },
        discountValue: { type: Number, required: true, default: 0 },
        discountPercent: { type: Number, required: true, default: 0 },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        validUpto: { type: Date, required: false },
    },
    { _id: true }  // Enable _id for subdocuments to allow edit/delete operations
);
