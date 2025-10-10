import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";

export const dynamic = 'force-dynamic';

/**
 * Migration endpoint to add _id to existing offers that don't have them
 * This is needed because the schema was changed from _id: false to _id: true
 */
export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { merchantId } = body;

        if (!merchantId) {
            return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
        }

        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
        }

        // Check if any offers are missing _id
        const offersWithoutId = partner.offlineDiscount.filter((offer: any) => !offer._id);

        if (offersWithoutId.length === 0) {
            return NextResponse.json({
                success: true,
                message: "All offers already have IDs",
                migrated: 0,
                offers: partner.offlineDiscount
            });
        }

        // Create a new array with all offers (MongoDB will auto-generate _id for new subdocuments)
        const migratedOffers = partner.offlineDiscount.map((offer: any) => {
            if (offer._id) {
                return offer; // Keep existing offers with IDs
            }
            // Return offer data without _id - MongoDB will generate new one
            return {
                category: offer.category,
                offerTitle: offer.offerTitle,
                offerDescription: offer.offerDescription,
                discountValue: offer.discountValue || 0,
                discountPercent: offer.discountPercent || 0,
                status: offer.status || 'Active',
                validUpto: offer.validUpto
            };
        });

        // Replace the entire array
        partner.offlineDiscount = migratedOffers;
        await partner.save();

        return NextResponse.json({
            success: true,
            message: `Successfully migrated ${offersWithoutId.length} offers`,
            migrated: offersWithoutId.length,
            offers: partner.offlineDiscount
        });
    } catch (err) {
        console.error("Error migrating offers:", err);
        return NextResponse.json({ error: "Failed to migrate offers" }, { status: 500 });
    }
}