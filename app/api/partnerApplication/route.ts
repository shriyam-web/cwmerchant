// app/api/partnerApplication/route.js
export const dynamic = "force-dynamic"; // ⬅️ Add this line
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const data = await req.json();

    // Application ID generate on server
    const appId = "CW-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    data.applicationId = appId;

    const newPartner = new Partner(data);
    await newPartner.save();

    return NextResponse.json({ 
      message: "Application saved", 
      applicationId: appId 
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to save application", details: err.message },
      { status: 500 }
    );
  }
}

