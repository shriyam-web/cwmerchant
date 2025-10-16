import { Schema } from "mongoose";
import { IFAQ } from "./product.interface";

export const FAQSchema = new Schema<IFAQ>(
    {
        question: { type: String },
        answer: { type: String },
        certifiedBuyer: { type: Boolean },
        isLike: { type: Boolean, default: false },
    },
    { _id: false }
);
