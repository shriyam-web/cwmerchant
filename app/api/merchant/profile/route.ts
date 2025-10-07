import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { merchantId, ...updateData } = body;

        console.log('PUT /api/merchant/profile - merchantId:', merchantId);
        console.log('updateData:', JSON.stringify(updateData, null, 2));

        if (!merchantId) {
            return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
        }

        // Check phone uniqueness if changed
        if (updateData.phone) {
            const existingPhone = await Partner.findOne({ phone: updateData.phone, _id: { $ne: merchantId } });
            if (existingPhone) {
                return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
            }
        }

        // Find and update the partner
        const updatedPartner = await Partner.findByIdAndUpdate(
            merchantId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log('updatedPartner:', updatedPartner ? 'found' : 'not found');
        if (updatedPartner) {
            console.log('bankDetails after update:', updatedPartner.bankDetails);
        }

        if (!updatedPartner) {
            return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
        }

        // Return the updated merchant data (similar to dashboard response)
        const response = {
            id: updatedPartner._id.toString(),
            merchantId: updatedPartner.merchantId,
            legalName: updatedPartner.legalName || "",
            displayName: updatedPartner.displayName,
            businessName: updatedPartner.displayName || updatedPartner.legalName,
            merchantSlug: updatedPartner.merchantSlug,
            email: updatedPartner.email,
            emailVerified: updatedPartner.emailVerified,
            phone: updatedPartner.phone,
            category: updatedPartner.category,
            city: updatedPartner.city,
            streetAddress: updatedPartner.streetAddress || "",
            pincode: updatedPartner.pincode || "",
            locality: updatedPartner.locality || "",
            state: updatedPartner.state || "",
            country: updatedPartner.country || "India",
            whatsapp: updatedPartner.whatsapp,
            gstNumber: updatedPartner.gstNumber,
            panNumber: updatedPartner.panNumber,
            businessType: updatedPartner.businessType,
            yearsInBusiness: updatedPartner.yearsInBusiness,
            averageMonthlyRevenue: updatedPartner.averageMonthlyRevenue,
            discountOffered: updatedPartner.discountOffered,
            description: updatedPartner.description,
            website: updatedPartner.website || "",
            socialLinks: {
                linkedin: updatedPartner.socialLinks?.linkedin || "",
                x: updatedPartner.socialLinks?.x || "",
                youtube: updatedPartner.socialLinks?.youtube || "",
                instagram: updatedPartner.socialLinks?.instagram || "",
                facebook: updatedPartner.socialLinks?.facebook || "",
            },
            businessHours: updatedPartner.businessHours || { open: "", close: "", days: [] },
            agreeToTerms: updatedPartner.agreeToTerms,
            tags: updatedPartner.tags || [],
            purchasedPackage: updatedPartner.purchasedPackage,
            paymentMethodAccepted: updatedPartner.paymentMethodAccepted,
            minimumOrderValue: updatedPartner.minimumOrderValue,
            qrcodeLink: updatedPartner.qrcodeLink || "",
            storeImages: updatedPartner.storeImages || [],
            mapLocation: updatedPartner.mapLocation || "",
            logo: updatedPartner.logo || "",
            bankDetails: updatedPartner.bankDetails || {},
            status: updatedPartner.status || "pending",
        };

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            merchant: response
        });
    } catch (err) {
        console.error("Error updating profile:", err);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
