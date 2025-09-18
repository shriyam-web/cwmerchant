import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";
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

    // ❌ Status check
    if (partner.status !== "active") {
      let message = "Your account is not active. Contact support.";
      if (partner.status === "pending") {
        message = "Your account is pending approval. Please wait up to 48 hours.";
      } else if (partner.status === "suspended") {
        message = "Your account has been suspended due to policy violations. Contact support.";
      } else if (partner.status === "rejected") {
        message = "Your account application has been rejected. Contact support for details.";
      }

      return NextResponse.json({ error: message }, { status: 403 });
    }

    // ✅ Success → Generate JWT
    const token = jwt.sign(
      { id: partner._id, email: partner.email, role: "merchant" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      merchant: {
        id: partner._id.toString(),
        email: partner.email,
        businessName: partner.businessName,
        role: "merchant",
        status: partner.status,
      },
    });
  } catch (err) {
    console.error("Merchant login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
