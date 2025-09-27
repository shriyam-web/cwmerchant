import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();
    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and new password required" }, { status: 400 });
    }

    await dbConnect();
    const partner = await Partner.findOne({ email });
    if (!partner) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    partner.password = hashedPassword;
    partner.otpCode = null;
    partner.otpExpiry = null;
    await partner.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
