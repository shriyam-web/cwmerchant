// app/api/merchant/dashboard/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import OfflinePurchaseRequest from "@/models/OfflinePurchaseRequest";

const parseNumericValue = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const numeric = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
  }
  return 0;
};

const parseAmount = (value: unknown) => parseNumericValue(value);

const resolveAmount = (...values: unknown[]) => {
  for (const value of values) {
    const parsed = parseAmount(value);
    if (parsed > 0) {
      return parsed;
    }
  }
  return 0;
};

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

    const stats = [
      {
        title: "Total Products",
        value: partner.products?.length || 0,
        change: "+2 this week",
        changeType: "positive",
        icon: "Gift",
      },
      {
        title: "Average Rating",
        value: partner.averageRating?.toFixed(1) || "0.0",
        change: `${partner.ratings?.length || 0} reviews`,
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
        value: `₹${partner.totalEarnings || 0}`,
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
        value: partner.products?.length || 0,
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

    console.log("Partner ID:", partner._id, "Partner merchantId:", partner.merchantId);

    let offlineRequests: any[] = [];

    if (partner.merchantId) {
      console.log("Querying OfflinePurchaseRequest with merchantId:", partner.merchantId);
      offlineRequests = await OfflinePurchaseRequest.find({
        merchantId: partner.merchantId
      }).sort({ createdAt: -1 }).lean();
    }

    if (offlineRequests.length === 0) {
      console.log("No requests found with merchantId, trying with Partner ID");
      offlineRequests = await OfflinePurchaseRequest.find({
        merchantId: partner._id.toString()
      }).sort({ createdAt: -1 }).lean();
    }

    console.log("Found offline requests:", offlineRequests.length);

    const requests = offlineRequests.map((request: any) => {
      const timestamp = request.createdAt || request.date;
      const purchaseAmountValue = resolveAmount(
        request.purchaseAmount,
        request.originalAmount,
        request.actualPrice,
        request.originalPrice,
        request.amountBeforeDiscount,
        request.amount
      );
      const finalAmountValue = resolveAmount(
        request.finalAmount,
        request.finalPrice,
        request.amountAfterDiscount,
        request.discountedAmount,
        request.discountedPrice,
        request.amount,
        purchaseAmountValue
      );
      const discountRaw = parseAmount(
        request.discountApplied ??
        request.discountAmount ??
        request.discount ??
        request.savings ??
        0
      );
      const discountAmount = discountRaw > 0
        ? discountRaw
        : purchaseAmountValue > 0 && finalAmountValue > 0
          ? Math.max(purchaseAmountValue - finalAmountValue, 0)
          : undefined;
      const discountPercent = discountAmount && purchaseAmountValue > 0
        ? Math.round((discountAmount / purchaseAmountValue) * 100)
        : undefined;
      const status = String(request.status || "pending").toLowerCase();
      return {
        id: request.offlinePurchaseId || String(request._id),
        customerName: request.userName || "",
        amount: finalAmountValue || purchaseAmountValue || 0,
        originalAmount: purchaseAmountValue > 0 ? purchaseAmountValue : undefined,
        purchaseAmount: purchaseAmountValue > 0 ? purchaseAmountValue : undefined,
        finalAmount: finalAmountValue > 0 ? finalAmountValue : undefined,
        discountAmount,
        discountPercent,
        product: request.productPurchased || "",
        submittedAt: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
        status,
        customerPhone: request.userMobileNo || "",
      };
    });

    const response = {
      merchant: {
        id: partner._id.toString(),
        merchantId: partner.merchantId,
        legalName: partner.legalName || "",
        displayName: partner.displayName,
        businessName: partner.displayName || partner.legalName,
        merchantSlug: partner.merchantSlug,
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
          x: partner.socialLinks?.x || "",
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
        logo: partner.logo || "",
        bankDetails: partner.bankDetails || {},
        status: partner.status || "pending",
        totalGraphics: partner.totalGraphics || 0,
        totalReels: partner.totalReels || 0,
        totalPodcast: partner.totalPodcast || 0,
        completedPodcast: partner.completedPodcast || 0,
        isWebsite: partner.isWebsite || false,
        ds_graphics: partner.ds_graphics || [],
        ds_reel: partner.ds_reel || [],
        ds_weblog: partner.ds_weblog || [],
        podcastLog: partner.podcastLog || [],
      },
      stats,
      requests,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error in GET /dashboard:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { requestId, status } = body;

    if (!requestId || !status) {
      return NextResponse.json({ error: "Request ID and status are required" }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending', 'expired'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Try finding by offlinePurchaseId first, then by _id
    let purchaseRequest = await OfflinePurchaseRequest.findOne({ offlinePurchaseId: requestId });

    if (!purchaseRequest) {
      purchaseRequest = await OfflinePurchaseRequest.findById(requestId);
    }

    if (!purchaseRequest) {
      return NextResponse.json({ error: "Purchase request not found" }, { status: 404 });
    }

    purchaseRequest.status = status;
    await purchaseRequest.save();

    return NextResponse.json({
      success: true,
      message: `Purchase request ${status}`,
      request: {
        id: purchaseRequest.offlinePurchaseId || purchaseRequest._id.toString(),
        status: purchaseRequest.status
      }
    });
  } catch (err) {
    console.error("Error in PATCH /dashboard:", err);
    return NextResponse.json({ error: "Failed to update purchase request" }, { status: 500 });
  }
}
