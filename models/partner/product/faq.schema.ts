import { Schema } from "mongoose";

export const FAQSchema = new Schema(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        certifiedBuyer: { type: Boolean, required: true },
        isLike: { type: Boolean, default: false },
    },
    { _id: false }
);
