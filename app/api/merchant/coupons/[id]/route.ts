import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/partner';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const couponId = params.id;
    const body = await request.json();
    const { merchantId, ...updateData } = body;

    if (!merchantId) {
      return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
    }

    if (!couponId) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };

    Object.keys(updateData).forEach((key) => {
      if (key !== '_id' && key !== 'usedCount' && key !== 'createdAt' && key !== 'merchantId') {
        updateFields[`coupons.$.${key}`] = updateData[key];
      }
    });

    const partner = await Partner.findOneAndUpdate(
      { _id: merchantId, 'coupons._id': couponId },
      { $set: updateFields },
      { new: true, runValidators: false }
    );

    if (!partner) {
      return NextResponse.json({ error: 'Merchant or coupon not found' }, { status: 404 });
    }

    const updatedCoupon = partner.coupons?.find((c: any) => c._id?.toString() === couponId);

    return NextResponse.json({
      message: 'Coupon updated successfully',
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update coupon',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const couponId = params.id;
    const url = new URL(request.url);
    const merchantId = url.searchParams.get('merchantId');

    if (!merchantId || !couponId) {
      return NextResponse.json(
        { error: 'Merchant ID and Coupon ID required' },
        { status: 400 }
      );
    }

    const partner = await Partner.findByIdAndUpdate(
      merchantId,
      { $pull: { coupons: { _id: couponId } } },
      { new: true, runValidators: false }
    );

    if (!partner) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Coupon deleted successfully',
      total: partner.coupons?.length || 0,
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to delete coupon',
      },
      { status: 500 }
    );
  }
}
