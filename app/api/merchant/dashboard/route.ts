// app/api/merchant/dashboard/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";

export const dynamic = 'force-dynamic';

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
      {
        title: "Purchased Package",
        value: partner.purchasedPackage?.variantName || "None",
        change: partner.purchasedPackage?.expiryDate ? `Expires ${new Date(partner.purchasedPackage.expiryDate).toLocaleDateString()}` : "",
        changeType: "neutral",
        icon: "Gift",
      },
      {
        title: "Total Earnings",
        value: `₹${partner.totalEarnings}`,
        change: "",
        changeType: "neutral",
        icon: "DollarSign",
      },
      {
        title: "Monthly Revenue",
        value: `₹${partner.averageMonthlyRevenue || 0}`,
        change: "+5.1%",
        changeType: "positive",
        icon: "TrendingUp",
      },
      {
        title: "Active Offers",
        value: partner.products.length, // Assuming offers are tied to products
        change: "+1 this month",
        changeType: "positive",
        icon: "AlertTriangle",
      },
      {
        title: "Total Customers",
        value: "150",
        change: "+10 this month",
        changeType: "positive",
        icon: "Users",
      },
      {
        title: "Orders Fulfilled",
        value: "245",
        change: "+15%",
        changeType: "positive",
        icon: "CheckCircle",
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
        legalName: partner.legalName || "",
        displayName: partner.displayName,
        email: partner.email,
        emailVerified: partner.emailVerified,
        phone: partner.phone,
        category: partner.category,
        city: partner.city,
        streetAddress: partner.streetAddress || "",
        pincode: partner.pincode || "",
        locality: partner.locality || "",
        state: partner.state || "",
        country: partner.country || "India",
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
        businessHours: partner.businessHours || { open: "", close: "", days: [] },
        agreeToTerms: partner.agreeToTerms,
        tags: partner.tags || [],
        purchasedPackage: partner.purchasedPackage,
        paymentMethodAccepted: partner.paymentMethodAccepted,
        minimumOrderValue: partner.minimumOrderValue,
        qrcodeLink: partner.qrcodeLink || "",
        storeImages: partner.storeImages || [],
        mapLocation: partner.mapLocation || "",
        status: partner.status || "pending",
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
