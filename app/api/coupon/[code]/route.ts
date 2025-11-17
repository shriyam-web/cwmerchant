import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/partner';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await dbConnect();

    const couponCode = params.code.toUpperCase();
    console.log('[API] GET /api/coupon/[code] - couponCode:', couponCode);

    const partner = await Partner.findOne({
      'coupons.code': couponCode,
    });

    if (!partner) {
      console.error('[API] Coupon not found:', couponCode);
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    const coupon = partner.coupons.find(
      (c: any) => c.code.toUpperCase() === couponCode
    );

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      coupon,
      merchant: {
        id: partner._id.toString(),
        displayName: partner.displayName || partner.legalName,
        businessName: partner.businessName,
        category: partner.category,
        streetAddress: partner.streetAddress || '',
        locality: partner.locality || '',
        city: partner.city || '',
        phone: partner.phone || '',
        email: partner.email || '',
        website: partner.website || '',
        logo: partner.logo || '',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching coupon:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch coupon',
        debug: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
