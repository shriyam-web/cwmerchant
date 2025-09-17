import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });

    await dbConnect();
    const partner = await Partner.findOne({ email });
    if (!partner) return NextResponse.json({ error: "Invalid email" }, { status: 404 });

    if (partner.otpCode !== otp || !partner.otpExpiry || partner.otpExpiry < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
