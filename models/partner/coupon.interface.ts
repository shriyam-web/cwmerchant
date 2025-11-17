import { Document } from 'mongoose';

export interface ICoupon extends Document {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  status: 'active' | 'inactive';
  userId?: string;
  isRestricted?: boolean;
  qrCodeData?: string;
  seriesId?: string;
  sequence?: number;
  seriesNote?: string;
  theme?: 'classic' | 'friendship' | 'love' | 'gift' | 'festival' | 'sale' | 'emoji' | 'first-time' | 'missed-you' | 'birthday' | 'holiday' | 'seasonal' | 'weekend' | 'student' | 'senior' | 'bulk' | 'flash' | 'members' | 'loyalty' | 'launch' | 'bonus';
  createdAt?: Date;
  updatedAt?: Date;
}
