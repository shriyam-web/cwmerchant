// import dbConnect from "@/lib/mongodb";
// import Partner from "@/models/Partner";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     const { email, password } = await req.json();

//     const partner = await Partner.findOne({ email });
//     if (!partner) {
//       return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
//     }

//     const isMatch = await bcrypt.compare(password, partner.password);
//     if (!isMatch) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     // Optionally check approval status
//     if (partner.status !== "active") {
//       return NextResponse.json({ error: "Your account is currently under review. Please allow up to 48 hours for approval by the CityWitty Admin after your profile has been evaluated." }, { status: 403 });
//     }

//     return NextResponse.json({
//       id: partner._id,
//       email: partner.email,
//       businessName: partner.businessName,
//       role: "merchant",
//     });
//   } catch (err) {
//     console.error("Merchant login error:", err);
//     return NextResponse.json({ error: "Login failed" }, { status: 500 });
//   }
// }
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

    if (!partner) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (partner.status !== "active") {
      return NextResponse.json(
        { error: "Your account is under review. Please allow 48 hours for approval." },
        { status: 403 }
      );
    }

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
      },
    });
  } catch (err) {
    console.error("Merchant login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
