import { Schema, Document, model, models } from "mongoose";

export interface IOfflineProduct extends Document {
    offlineProductId: string;
    merchantId: string;
    productName: string;
    sku?: string;
    category: string;
    description: string;
    price: number;
    offerPrice?: number;
    availableStock: number;
    unit?: string;
    brand?: string;
    tags?: string[];
    imageUrls?: string[];
    barcode?: string;
    status: "active" | "inactive";
    createdAt?: Date;
    updatedAt?: Date;
}

const OfflineProductSchema = new Schema<IOfflineProduct>(
    {
        offlineProductId: { type: String, required: true, unique: true },
        merchantId: { type: String, required: true, index: true },
        productName: { type: String, required: true },
        sku: { type: String },
        category: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        offerPrice: { type: Number },
        availableStock: { type: Number, required: true },
        unit: { type: String },
        brand: { type: String },
        tags: [{ type: String }],
        imageUrls: [{ type: String }],
        barcode: { type: String },
        status: { type: String, enum: ["active", "inactive"], default: "active" }
    },
    { timestamps: true, collection: "offline-products" }
);

export default models.OfflineProduct || model<IOfflineProduct>("OfflineProduct", OfflineProductSchema);
