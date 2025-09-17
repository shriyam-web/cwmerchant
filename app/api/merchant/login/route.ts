import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const partner = await Partner.findOne({ email });
    if (!partner) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Optionally check approval status
    if (partner.status !== "active") {
      return NextResponse.json({ error: "Your account is currently under review. Please allow up to 48 hours for approval by the CityWitty Admin after your profile has been evaluated." }, { status: 403 });
    }

    return NextResponse.json({
      id: partner._id,
      email: partner.email,
      businessName: partner.businessName,
      role: "merchant",
    });
  } catch (err) {
    console.error("Merchant login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
