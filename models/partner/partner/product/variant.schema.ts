import { InferSchemaType, Schema } from "mongoose";

const VariantDefinition = new Schema(
    {
        variantId: { type: String },
        name: { type: String },
        price: { type: Number },
        stock: { type: Number },
    },
    { _id: false }
);

export type VariantDocument = InferSchemaType<typeof VariantDefinition>;

export const VariantSchema: Schema<VariantDocument> = VariantDefinition;
