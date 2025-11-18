import { Schema } from 'mongoose';
import { ICoupon } from './coupon.interface';

export const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minPurchase: { type: Number },
  maxDiscount: { type: Number },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  userId: { type: String },
  isRestricted: { type: Boolean, default: false },
  qrCodeData: { type: String },
  seriesId: { type: String },
  sequence: { type: Number },
  seriesNote: { type: String },
  theme: { type: String, enum: ['classic', 'friendship', 'love', 'gift', 'festival', 'sale', 'emoji', 'first-time', 'missed-you', 'birthday', 'holiday', 'seasonal', 'weekend', 'student', 'senior', 'bulk', 'flash', 'members', 'loyalty', 'launch', 'bonus'], default: 'classic' },
  couponType: { type: String, enum: ['regular', 'happy-hour'], default: 'regular' },
  happyHourDays: { type: [String] },
  happyHourStartTime: { type: String },
  happyHourEndTime: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
