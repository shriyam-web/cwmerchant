import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const normalizedEmail = email.toLowerCase();
    const partner = await Partner.findOne({ email: normalizedEmail });

    // ❌ Merchant not found
    if (!partner) {
      return NextResponse.json(
        { error: "Merchant not found. Please register first." },
        { status: 404 }
      );
    }

    // ❌ Wrong password
    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your password." },
        { status: 401 }
      );
    }

    // ❌ Status check - only block suspended and rejected
    if (partner.status === "suspended") {
      return NextResponse.json({ error: "Your account has been suspended due to policy violations. Contact support." }, { status: 403 });
    } else if (partner.status === "rejected") {
      return NextResponse.json({ error: "Your account application has been rejected. Contact support for details." }, { status: 403 });
    }

    // ✅ Success → Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    const token = jwt.sign(
      { id: partner._id, email: partner.email, role: "merchant" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      merchant: {
        id: partner._id.toString(),
        merchantId: partner.merchantId,
        email: partner.email,
        businessName: partner.displayName || partner.legalName,
        role: "merchant",
        status: partner.status,
      },
    });
  } catch (err) {
    console.error("Merchant login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
