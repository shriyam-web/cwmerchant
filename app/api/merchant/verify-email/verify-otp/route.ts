import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";

export async function POST(req: NextRequest) {
  try {
    const { merchantId, otp } = await req.json();
    
    if (!merchantId || !otp) {
      return NextResponse.json({ error: "Merchant ID and OTP required" }, { status: 400 });
    }

    await dbConnect();
    const partner = await Partner.findById(merchantId);
    
    if (!partner) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    // Check if email is already verified
    if (partner.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    // Verify OTP
    if (
      partner.emailVerificationOtp !== otp || 
      !partner.emailVerificationOtpExpiry || 
      partner.emailVerificationOtpExpiry < new Date()
    ) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Mark email as verified
    partner.emailVerified = true;
    partner.emailVerificationOtp = undefined;
    partner.emailVerificationOtpExpiry = undefined;
    await partner.save();

    return NextResponse.json({ 
      success: true, 
      message: "Email verified successfully!",
      merchant: {
        id: partner._id,
        email: partner.email,
        emailVerified: partner.emailVerified,
        businessName: partner.businessName,
        displayName: partner.displayName,
        status: partner.status
      }
    });
  } catch (err) {
    console.error("Verify Email OTP Error:", err);
    return NextResponse.json({ error: "Failed to verify OTP. Please try again." }, { status: 500 });
  }
}