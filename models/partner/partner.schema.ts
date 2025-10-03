import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
  merchantId: string;
  legalName?: string;
  displayName?: string;
  merchantSlug?: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  category?: string;
  city?: string;
  streetAddress?: string;
  pincode?: string;
  locality?: string;
  state?: string;
  country?: string;
  whatsapp?: string;
  gstNumber?: string;
  panNumber?: string;
  businessType?: string;
  yearsInBusiness?: number;
  averageMonthlyRevenue?: number;
  discountOffered?: number;
  description?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    x?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  businessHours?: {
    open: string;
    close: string;
    days: string[];
  };
  agreeToTerms?: boolean;
  tags?: string[];
  purchasedPackage?: {
    variantName: string;
    expiryDate: Date;
  };
  paymentMethodAccepted?: string[];
  minimumOrderValue?: number;
  qrcodeLink?: string;
  storeImages?: string[];
  mapLocation?: string;
  status?: string;
}

const PartnerSchema: Schema = new Schema({
  merchantId: { type: String, required: true, unique: true },
  legalName: { type: String },
  displayName: { type: String },
  merchantSlug: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  phone: { type: String },
  category: { type: String },
  city: { type: String },
  streetAddress: { type: String },
  pincode: { type: String },
  locality: { type: String },
  state: { type: String },
  country: { type: String, default: "India" },
  whatsapp: { type: String },
  gstNumber: { type: String },
  panNumber: { type: String },
  businessType: { type: String },
  yearsInBusiness: { type: Number },
  averageMonthlyRevenue: { type: Number },
  discountOffered: { type: Number },
  description: { type: String },
  website: { type: String },
  socialLinks: {
    linkedin: { type: String },
    x: { type: String },
    youtube: { type: String },
    instagram: { type: String },
    facebook: { type: String },
  },
  businessHours: {
    open: { type: String },
    close: { type: String },
    days: [{ type: String }],
  },
  agreeToTerms: { type: Boolean },
  tags: [{ type: String }],
  purchasedPackage: {
    variantName: { type: String },
    expiryDate: { type: Date },
  },
  paymentMethodAccepted: [{ type: String }],
  minimumOrderValue: { type: Number },
  qrcodeLink: { type: String },
  storeImages: [{ type: String }],
  mapLocation: { type: String },
  status: { type: String, default: "pending" },
});

export default mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);
