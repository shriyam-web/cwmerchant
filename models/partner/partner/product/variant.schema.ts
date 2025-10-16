import { Schema } from "mongoose";
import { IVariant } from "./product.interface";

export const VariantSchema = new Schema<IVariant>(
    {
        variantId: { type: String, },
        name: { type: String, },
        price: { type: Number, },
        stock: { type: Number, },
    },
    { _id: false }
);
