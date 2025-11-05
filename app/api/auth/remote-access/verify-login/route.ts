import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RemoteAccessOTP } from '@/models/RemoteAccessOTP';
import Partner from '@/models/partner';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'citywittymerchant@gmail.com';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, merchantId } = await request.json();

    // Validate required fields
    if (!email || !otp || !merchantId) {
      return NextResponse.json(
        { error: 'Email, OTP, and Merchant ID are required' },
        { status: 400 }
      );
    }

    // Validate admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized email address' },
        { status: 403 }
      );
    }

    await connectDB();

    // Verify OTP
    const otpRecord = await RemoteAccessOTP.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 401 }
      );
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 401 }
      );
    }

    if (new Date() > otpRecord.expiresAt) {
      await RemoteAccessOTP.findOneAndDelete({ email });
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 401 }
      );
    }

    // Find merchant by merchantId
    const merchant = await Partner.findOne({ merchantId });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Check merchant status
    if (merchant.status === 'suspended') {
      return NextResponse.json(
        { error: 'This merchant account is suspended' },
        { status: 403 }
      );
    }

    // Delete used OTP
    await RemoteAccessOTP.findOneAndDelete({ email });

    // Generate JWT token with remoteAccess flag
    const token = jwt.sign(
      {
        id: merchant._id,
        email: merchant.email,
        role: 'merchant',
        merchantId: merchant.merchantId,
        remoteAccess: true, // Flag for audit purposes
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return merchant credentials
    return NextResponse.json({
      success: true,
      token,
      merchant: {
        id: merchant._id,
        email: merchant.email,
        businessName: merchant.businessName,
        role: 'merchant',
        status: merchant.status,
        merchantId: merchant.merchantId,
        displayName: merchant.displayName,
        remoteAccess: true,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP and login' },
      { status: 500 }
    );
  }
}