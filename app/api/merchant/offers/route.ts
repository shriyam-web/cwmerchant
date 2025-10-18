import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

// GET - Fetch all offers for a merchant
export async function GET(req: Request) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const merchantId = url.searchParams.get("merchantId");

        if (!merchantId) {
            return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
        }

        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
        }

        const offers = (partner.offlineDiscount || []).map((offer: any) => ({
            _id: offer._id,
            category: offer.category,
            offerTitle: offer.offerTitle,
            offerDescription: offer.offerDescription,
            originalPrice: offer.originalPrice,
            discountValue: offer.discountValue,
            discountPercent: offer.discountPercent,
            status: offer.status,
            validUpto: offer.validUpto
        }));

        return NextResponse.json({
            success: true,
            offers: offers
        });
    } catch (err) {
        console.error("Error fetching offers:", err);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}

// POST - Create a new offer
export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { merchantId, ...offerData } = body;

        if (!merchantId) {
            return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
        }

        // Validate required fields
        const requiredFields = ['category', 'offerTitle', 'offerDescription'];
        for (const field of requiredFields) {
            if (!offerData[field]) {
                return NextResponse.json({ error: `${field} is required` }, { status: 400 });
            }
        }

        if (!offerData.originalPrice || offerData.originalPrice <= 0) {
            return NextResponse.json({ error: "Original price must be greater than 0" }, { status: 400 });
        }

        // Validate at least one discount type is provided
        if ((!offerData.discountValue || offerData.discountValue <= 0) &&
            (!offerData.discountPercent || offerData.discountPercent <= 0)) {
            return NextResponse.json({ error: "At least one discount type (value or percent) must be greater than 0" }, { status: 400 });
        }

        if (offerData.discountValue && offerData.discountPercent) {
            const valueFromPercent = offerData.originalPrice * (offerData.discountPercent / 100);
            if (valueFromPercent !== offerData.discountValue) {
                return NextResponse.json({ error: "Discount value must align with discount percent" }, { status: 400 });
            }
        }

        // Validate validUpto is required for Active offers
        if (offerData.status === 'Active' && !offerData.validUpto) {
            return NextResponse.json({ error: "Valid until date is required for active offers" }, { status: 400 });
        }

        // Ensure status is valid
        if (offerData.status && !['Active', 'Inactive'].includes(offerData.status)) {
            return NextResponse.json({ error: "Status must be 'Active' or 'Inactive'" }, { status: 400 });
        }

        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
        }

        const originalPrice = Math.max(Number(offerData.originalPrice || 0), 0);
        const discountValue = Math.min(Math.max(Number(offerData.discountValue || 0), 0), originalPrice);
        const discountPercent = Math.min(Math.max(Number(offerData.discountPercent || 0), 0), 100);

        partner.offlineDiscount.push({
            ...offerData,
            originalPrice,
            discountValue,
            discountPercent,
            status: offerData.status || 'Active'
        });

        await partner.save();

        return NextResponse.json({
            success: true,
            message: "Offer created successfully",
            offers: partner.offlineDiscount
        });
    } catch (err) {
        console.error("Error creating offer:", err);
        return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
    }
}

// PUT - Update an existing offer
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { merchantId, offerId, ...updateData } = body;

        if (!merchantId || !offerId) {
            return NextResponse.json({ error: "Merchant ID and Offer ID required" }, { status: 400 });
        }

        // Ensure status is valid if provided
        if (updateData.status && !['Active', 'Inactive'].includes(updateData.status)) {
            return NextResponse.json({ error: "Status must be 'Active' or 'Inactive'" }, { status: 400 });
        }

        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
        }

        // Find and update the offer
        const offerIndex = partner.offlineDiscount.findIndex(
            (offer: any) => offer._id?.toString() === offerId
        );

        if (offerIndex === -1) {
            console.error(`Offer not found. OfferId: ${offerId}, Available IDs:`,
                partner.offlineDiscount.map((o: any) => o._id?.toString()));
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        // Update the offer - preserve existing values if not provided
        const originalPrice = Math.max(Number((updateData.originalPrice ?? partner.offlineDiscount[offerIndex].originalPrice) ?? 0), 0);
        const discountValue = updateData.discountValue !== undefined
            ? Math.min(Math.max(Number(updateData.discountValue || 0), 0), originalPrice)
            : Math.min(partner.offlineDiscount[offerIndex].discountValue || 0, originalPrice);
        const discountPercent = updateData.discountPercent !== undefined
            ? Math.min(Math.max(Number(updateData.discountPercent || 0), 0), 100)
            : Math.min(partner.offlineDiscount[offerIndex].discountPercent || 0, 100);

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                partner.offlineDiscount[offerIndex][key] = updateData[key];
            }
        });

        partner.offlineDiscount[offerIndex].originalPrice = originalPrice;
        partner.offlineDiscount[offerIndex].discountValue = discountValue;
        partner.offlineDiscount[offerIndex].discountPercent = discountPercent;

        await partner.save();

        return NextResponse.json({
            success: true,
            message: "Offer updated successfully",
            offers: partner.offlineDiscount
        });
    } catch (err) {
        console.error("Error updating offer:", err);
        return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
    }
}

// DELETE - Delete an offer
export async function DELETE(req: Request) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const merchantId = url.searchParams.get("merchantId");
        const offerId = url.searchParams.get("offerId");

        if (!merchantId || !offerId) {
            return NextResponse.json({ error: "Merchant ID and Offer ID required" }, { status: 400 });
        }

        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
        }

        // Remove the offer
        const initialLength = partner.offlineDiscount.length;
        partner.offlineDiscount = partner.offlineDiscount.filter(
            (offer: any) => offer._id?.toString() !== offerId
        );

        if (partner.offlineDiscount.length === initialLength) {
            console.error(`Offer not found for deletion. OfferId: ${offerId}, Available IDs:`,
                partner.offlineDiscount.map((o: any) => o._id?.toString()));
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        await partner.save();

        return NextResponse.json({
            success: true,
            message: "Offer deleted successfully",
            offers: partner.offlineDiscount
        });
    } catch (err) {
        console.error("Error deleting offer:", err);
        return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
    }
}