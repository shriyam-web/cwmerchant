import { Schema, Document, model, models } from "mongoose";

export interface IPurchaseRequest extends Document {
    offlinePurchaseId?: string;
    userId: string;
    userName: string;
    userMobileNo: string;
    merchantId: string;
    merchantSlug: string;
    purchaseAmount: number;
    finalAmount: number;
    finalPrice?: number;
    actualPrice?: number;
    discountApplied: number;
    productPurchased: string;
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    createdAt?: Date;
    updatedAt?: Date;
}

const PurchaseRequestSchema = new Schema<IPurchaseRequest>(
    {
        offlinePurchaseId: { type: String },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userMobileNo: { type: String, required: true },
        merchantId: { type: String, required: true },
        merchantSlug: { type: String, required: true },
        purchaseAmount: { type: Number, required: true },
        finalAmount: { type: Number, required: true },
        finalPrice: { type: Number },
        actualPrice: { type: Number },
        discountApplied: { type: Number, required: true },
        productPurchased: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['pending', 'approved', 'rejected', 'expired'],
            default: 'pending',
            required: true 
        },
    },
    {
        timestamps: true,
        collection: "purchase-requests",
    }
);

export default models.PurchaseRequest ||
    model<IPurchaseRequest>("PurchaseRequest", PurchaseRequestSchema);
