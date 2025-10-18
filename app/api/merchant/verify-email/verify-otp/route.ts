import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { merchantId, otp } = await req.json();
    
    if (!merchantId || !otp) {
      return NextResponse.json({ error: "Merchant ID and OTP required" }, { status: 400 });
    }

    await dbConnect();
    const partnerQuery = Types.ObjectId.isValid(merchantId)
      ? { _id: merchantId }
      : { merchantId };

    const partner = await Partner.findOne(partnerQuery);
    
    if (!partner) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    if (partner.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    if (
      partner.emailVerificationOtp !== otp || 
      !partner.emailVerificationOtpExpiry || 
      partner.emailVerificationOtpExpiry < new Date()
    ) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      partner._id,
      {
        $set: { emailVerified: true },
        $unset: {
          emailVerificationOtp: "",
          emailVerificationOtpExpiry: ""
        }
      },
      { new: true, runValidators: false }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Email verified successfully!",
      merchant: {
        id: updatedPartner?._id,
        email: updatedPartner?.email,
        emailVerified: updatedPartner?.emailVerified,
        businessName: updatedPartner?.businessName,
        displayName: updatedPartner?.displayName,
        status: updatedPartner?.status
      }
    });
  } catch (err) {
    console.error("Verify Email OTP Error:", err);
    return NextResponse.json({ error: "Failed to verify OTP. Please try again." }, { status: 500 });
  }
}