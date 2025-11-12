
export const dynamic = "force-dynamic"; // ⬅️ Ensures route runs dynamically on every request

import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect(); // ✅ Connect to MongoDB
    const data = await req.json();

    // 🔎 Duplicate Check (Email, Phone, GST, PAN, Merchant Slug, Username)
    const duplicateConditions: any[] = [
      { email: data.email?.toLowerCase() },
      { phone: data.phone },
      { panNumber: data.panNumber },
      { merchantSlug: data.merchantSlug?.toLowerCase() },
      // { username: data.username?.toLowerCase() },
    ];

    // Only check GST duplicates if GST is provided
    if (data.hasGstNumber && data.gstNumber) {
      duplicateConditions.push({ gstNumber: data.gstNumber });
    }

    const existingPartner = await Partner.findOne({
      $or: duplicateConditions,
    });

    if (existingPartner) {
      let conflictField = "";
      if (existingPartner.email === data.email?.toLowerCase()) conflictField = "Email ID";
      else if (existingPartner.phone === data.phone) conflictField = "Phone Number";
      else if (data.hasGstNumber && data.gstNumber && existingPartner.gstNumber === data.gstNumber) conflictField = "GST Number";
      else if (existingPartner.panNumber === data.panNumber) conflictField = "PAN Number";
      else if (existingPartner.merchantSlug === data.merchantSlug?.toLowerCase()) conflictField = "Merchant Slug";
      // else if (existingPartner.username === data.username?.toLowerCase()) conflictField = "Username";

      return NextResponse.json(
        { error: `${conflictField} already exists. Please use a different one.` },
        { status: 400 }
      );
    }

    // 🎯 Generate Unique Merchant ID
    const merchantId = "CW-" + Math.random().toString(36).substring(2, 9).toUpperCase();

    data.merchantId = merchantId;
    data.status = "pending"; // Default status for new applications

    // 📩 Normalize Email, Merchant Slug, and Username
    if (data.email) {
      data.email = data.email.toLowerCase();
    }
    if (data.merchantSlug) {
      data.merchantSlug = data.merchantSlug.toLowerCase();
    }
    if (data.username) {
      data.username = data.username.toLowerCase();
    }

    // 🔐 Hash Password
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    // 💾 Save New Partner
    const newPartner = new Partner(data);
    await newPartner.save();

    return NextResponse.json({
      success: true,
      message: "Application saved successfully",
      merchantId,
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to save application", details: err.message },
      { status: 500 }
    );
  }
}