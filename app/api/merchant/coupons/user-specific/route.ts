import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/partner';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { coupons: couponData, merchantId } = body;

    if (!merchantId) {
      return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
    }

    if (!couponData) {
      return NextResponse.json({ error: 'Coupon data required' }, { status: 400 });
    }

    if (Array.isArray(couponData)) {
      const newCoupons = couponData.map((coupon: any) => ({
        ...coupon,
        _id: new mongoose.Types.ObjectId(),
        usedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const partner = await Partner.findByIdAndUpdate(
        merchantId,
        { $push: { coupons: { $each: newCoupons } } },
        { new: true, runValidators: false }
      );

      if (!partner) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'User-specific coupon created successfully',
        coupons: newCoupons,
        total: partner.coupons.length,
      });
    } else {
      const newCoupon = {
        ...couponData,
        _id: new mongoose.Types.ObjectId(),
        usedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const partner = await Partner.findByIdAndUpdate(
        merchantId,
        { $push: { coupons: newCoupon } },
        { new: true, runValidators: false }
      );

      if (!partner) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'User-specific coupon created successfully',
        coupon: newCoupon,
        total: partner.coupons.length,
      });
    }
  } catch (error) {
    console.error('Error creating user-specific coupon:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create user-specific coupon',
        debug: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
