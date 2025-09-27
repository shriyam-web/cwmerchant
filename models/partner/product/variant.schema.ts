import { Schema } from "mongoose";

export const VariantSchema = new Schema(
    {
        variantId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
    },
    { _id: false }
);
