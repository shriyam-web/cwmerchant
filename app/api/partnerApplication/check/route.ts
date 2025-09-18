// /app/api/partnerApplication/check/route.ts
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { field, value } = await req.json();

    if (!field || !value) {
      return NextResponse.json({ error: "Missing field or value" }, { status: 400 });
    }

    // allow only these fields for safety
    const allowed = ["email", "phone", "gstNumber", "panNumber"];
    if (!allowed.includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    const query: any = {};
query[field] = { $regex: `^${value}$`, $options: "i" };
const existing = await Partner.findOne(query).lean();


    return NextResponse.json({ exists: !!existing });
  } catch (err: any) {
    console.error("check API error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
