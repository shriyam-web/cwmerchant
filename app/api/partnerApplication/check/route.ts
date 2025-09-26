export const dynamic = "force-dynamic";

import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { field, value } = await req.json();

    if (!field || !value) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    let query: any = {};
    if (field === "email") {
      query.email = value.toLowerCase();
    } else if (["phone", "gstNumber", "panNumber"].includes(field)) {
      query[field] = value;
    } else {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    const existing = await Partner.findOne(query);
    return NextResponse.json({ exists: !!existing });
  } catch (err: any) {
    console.error("Check uniqueness error:", err);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
