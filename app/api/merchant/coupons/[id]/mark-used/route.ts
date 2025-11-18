import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/partner';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const couponId = params.id;
    const body = await request.json();
    const { merchantId } = body;

    if (!merchantId) {
      return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
    }

    if (!couponId) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    const partner = await Partner.findOneAndUpdate(
      { _id: merchantId, 'coupons._id': couponId },
      { 
        $inc: { 'coupons.$.usedCount': 1 },
        $set: { updatedAt: new Date() }
      },
      { new: true, runValidators: false }
    );

    if (!partner) {
      return NextResponse.json({ error: 'Merchant or coupon not found' }, { status: 404 });
    }

    const updatedCoupon = partner.coupons?.find((c: any) => c._id?.toString() === couponId);

    return NextResponse.json({
      message: 'Coupon marked as used successfully',
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Error marking coupon as used:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to mark coupon as used',
      },
      { status: 500 }
    );
  }
}
