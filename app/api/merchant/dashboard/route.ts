// app/api/merchant/dashboard/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // merchantId localStorage/session se aayega, abhi demo ke liye hardcoded
    const url = new URL(req.url);
    const merchantId = url.searchParams.get("merchantId");
    if (!merchantId) {
      return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
    }

    const partner = await Partner.findById(merchantId);
    if (!partner) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    // Example stats
    const stats = [
      {
        title: "Total Products",
        value: partner.products.length,
        change: "+2 this week",
        changeType: "positive",
        icon: "Gift",
      },
      {
        title: "Average Rating",
        value: partner.averageRating.toFixed(1),
        change: `${partner.ratings.length} reviews`,
        changeType: "neutral",
        icon: "Star",
      },
      {
        title: "Visibility",
        value: partner.visibility ? "Live" : "Hidden",
        change: partner.status,
        changeType: partner.visibility ? "positive" : "negative",
        icon: "Eye",
      },
    ];

    // Recent Requests (abhi demo ke liye dummy array)
    const requests = [
      {
        id: "1",
        customer: "Rahul Sharma",
        amount: "₹1,250",
        status: "pending",
        time: "2 hours ago",
      },
      {
        id: "2",
        customer: "Priya Singh",
        amount: "₹850",
        status: "approved",
        time: "5 hours ago",
      },
    ];

    return NextResponse.json({
      merchant: {
        id: partner._id,
        businessName: partner.businessName,
        category: partner.category,
        city: partner.city,
        joinedSince: partner.joinedSince,
        status: partner.status,          // 👈 yeh add karo
    visibility: partner.visibility,  // 👈 yeh bhi
      },
      stats,
      requests,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
