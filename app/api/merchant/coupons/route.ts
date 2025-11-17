import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/partner';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const merchantId = url.searchParams.get('merchantId');

    console.log('[API] GET /api/merchant/coupons - merchantId:', merchantId);

    if (!merchantId) {
      console.error('[API] Merchant ID missing from query params');
      return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
    }

    const partner = await Partner.findById(merchantId);
    if (!partner) {
      console.error('[API] Partner not found for merchantId:', merchantId);
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const coupons = partner.coupons || [];
    console.log('[API] Fetched coupons:', coupons.length);
    return NextResponse.json({
      coupons,
      total: coupons.length,
    });
  } catch (error) {
    console.error('[API] Error fetching coupons:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch coupons',
        debug: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { coupons: couponData, merchantId, isBulk, seriesNote } = body;

    console.log('[API] POST /api/merchant/coupons - merchantId:', merchantId);
    console.log('[API] isBulk flag received:', isBulk, 'Type:', typeof isBulk);
    console.log('[API] Coupons data is array:', Array.isArray(couponData));
    console.log('[API] Series note:', seriesNote);
    console.log('[API] Full body:', JSON.stringify(body, null, 2));

    if (!merchantId) {
      console.error('[API] Merchant ID missing from request body');
      return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
    }

    if (!couponData) {
      console.error('[API] Coupon data missing from request body');
      return NextResponse.json({ error: 'Coupon data required' }, { status: 400 });
    }

    if (Array.isArray(couponData)) {
      const seriesId = isBulk ? `series-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : undefined;
      console.log('[API] Array branch - isBulk:', isBulk, 'Will assign seriesId:', !!seriesId, 'seriesId:', seriesId);
      
      const newCoupons = couponData.map((coupon: any, index: number) => {
        const couponObj: any = {
          _id: new mongoose.Types.ObjectId(),
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          expiryDate: new Date(coupon.expiryDate),
          usedCount: 0,
          status: coupon.status || 'active',
          theme: coupon.theme || 'classic',
          seriesId,
          sequence: index + 1,
          seriesNote,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        if (coupon.minPurchase) couponObj.minPurchase = coupon.minPurchase;
        if (coupon.maxDiscount) couponObj.maxDiscount = coupon.maxDiscount;
        if (coupon.userId) {
          couponObj.userId = coupon.userId;
          couponObj.isRestricted = coupon.isRestricted || false;
        }
        return couponObj;
      });

      console.log('[API] newCoupons sample:', newCoupons[0]);
      
      const partner = await Partner.findByIdAndUpdate(
        merchantId,
        { $push: { coupons: { $each: newCoupons } } },
        { new: true, runValidators: false }
      );

      if (!partner) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: isBulk
          ? `${newCoupons.length} coupons generated successfully`
          : 'Coupon created successfully',
        coupons: newCoupons,
        total: partner.coupons.length,
        seriesId,
      });
    } else {
      const newCoupon: any = {
        _id: new mongoose.Types.ObjectId(),
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        expiryDate: new Date(couponData.expiryDate),
        usedCount: 0,
        status: couponData.status || 'active',
        theme: couponData.theme || 'classic',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (couponData.minPurchase) newCoupon.minPurchase = couponData.minPurchase;
      if (couponData.maxDiscount) newCoupon.maxDiscount = couponData.maxDiscount;
      if (couponData.userId) {
        newCoupon.userId = couponData.userId;
        newCoupon.isRestricted = couponData.isRestricted || false;
      }

      const partner = await Partner.findByIdAndUpdate(
        merchantId,
        { $push: { coupons: newCoupon } },
        { new: true, runValidators: false }
      );

      if (!partner) {
        return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Coupon created successfully',
        coupon: newCoupon,
        total: partner.coupons.length,
      });
    }
  } catch (error) {
    console.error('[API] Error saving coupon:', error);
    console.error('[API] Error details:', error instanceof Error ? error.message : String(error));
    console.error('[API] Stack:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to save coupon',
        debug: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}


