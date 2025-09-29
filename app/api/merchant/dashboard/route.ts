// app/api/merchant/dashboard/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const merchantId = url.searchParams.get("merchantId");
    if (!merchantId) {
      console.log("Merchant ID missing in request");
      return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
    }

    const partner = await Partner.findById(merchantId);
    if (!partner) {
      console.log(`Merchant not found for ID: ${merchantId}`);
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    console.log("Partner object fetched from DB:", partner);

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

    console.log("Stats to send:", stats);

    // Recent Requests (demo)
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

    console.log("Requests to send:", requests);

    const response = {
      merchant: {
        merchantId: partner.merchantId,
        businessName: partner.businessName,
        ownerName: partner.ownerName,
        email: partner.email,
        phone: partner.phone,
        category: partner.category,
        city: partner.city,
        address: partner.address,
        whatsapp: partner.whatsapp,
        gstNumber: partner.gstNumber,
        panNumber: partner.panNumber,
        businessType: partner.businessType,
        yearsInBusiness: partner.yearsInBusiness,
        averageMonthlyRevenue: partner.averageMonthlyRevenue,
        discountOffered: partner.discountOffered,
        description: partner.description,
        website: partner.website || "",
        socialLinks: {
          linkedin: partner.socialLinks?.linkedin || "",
          twitter: partner.socialLinks?.twitter || "",
          youtube: partner.socialLinks?.youtube || "",
          instagram: partner.socialLinks?.instagram || "",
          facebook: partner.socialLinks?.facebook || "",
        },
        logo: partner.logo || "",
        storeImages: partner.storeImages || [],
        mapLocation: partner.mapLocation || "",
        tags: partner.tags || [],
        status: partner.status || "pending", // ✅ yeh line add karo
      },
      stats,
      requests,
    };

    console.log("Final API response:", response);

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error in GET /dashboard:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
