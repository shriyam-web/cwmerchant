export const dynamic = "force-dynamic";

import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
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
    } else if (field === "merchantSlug") {
      query.merchantSlug = value.toLowerCase();
    } else if (["phone", "gstNumber", "panNumber"].includes(field)) {
      query[field] = value;
    } else {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    const existing = await Partner.findOne(query);
    const exists = !!existing;

    if (exists && field === "merchantSlug") {
      // Generate suggestions
      const baseSlug = value.toLowerCase();
      const suggestions: string[] = [];
      for (let i = 1; i <= 5 && suggestions.length < 3; i++) {
        const suggestedSlug = `${baseSlug}${i}`;
        const suggestedExists = await Partner.findOne({ merchantSlug: suggestedSlug });
        if (!suggestedExists) {
          suggestions.push(suggestedSlug);
        }
      }
      return NextResponse.json({ exists: true, suggestions });
    }

    return NextResponse.json({ exists });
  } catch (err: any) {
    console.error("Check uniqueness error:", err);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}