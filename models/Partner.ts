// models/Partner.js
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface IRating {
  user: string; // reviewer ka naam ya userId
  rating: number; // stars (1–5)
  review?: string;
  reply?: string; // admin/owner reply
  createdAt?: Date;
}

export interface IPartner extends Document {
  applicationId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  address: string;
  whatsapp: string;
  isWhatsappSame: boolean;
  gstNumber: string;
  panNumber: string;
  businessType: string;
  yearsInBusiness: string;
  averageMonthlyRevenue: string;
  discountOffered: string;
  description: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  agreeToTerms: boolean;

  // 🔥 New Fields
  products: IProduct[];
  logo?: string;
  storeImages?: string[];
  customOffer?: string;
  ribbonTag?: string;
  mapLocation?: string;
  visibility: boolean;
  joinedSince: Date;
  citywittyAssured: boolean;
  ratings: IRating[];
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

const RatingSchema = new Schema<IRating>({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  reply: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const PartnerSchema = new Schema<IPartner>(
  {
    applicationId: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    whatsapp: { type: String, required: true },
    isWhatsappSame: { type: Boolean, default: false },
    gstNumber: { type: String, required: true },
    panNumber: { type: String, required: true },
    businessType: { type: String, required: true },
    yearsInBusiness: { type: String, required: true },
    averageMonthlyRevenue: { type: String, required: true },
    discountOffered: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    agreeToTerms: { type: Boolean, required: true },

    // 🔥 New Fields
    products: [ProductSchema],
    logo: { type: String },
    storeImages: [{ type: String }],
    customOffer: { type: String },
    ribbonTag: { type: String },
    mapLocation: { type: String },
    visibility: { type: Boolean, default: false },
    joinedSince: { type: Date, default: Date.now },
    citywittyAssured: { type: Boolean, default: false },
    ratings: [RatingSchema],
  },
  { timestamps: true }
);

export default models.Partner || model<IPartner>("Partner", PartnerSchema);
