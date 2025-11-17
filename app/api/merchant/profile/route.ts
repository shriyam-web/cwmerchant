import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { merchantId, agentId, agentName, username, ...updateData } = body;

        // Handle nested onboardingAgent structure
        if (agentId !== undefined || agentName !== undefined) {
            updateData.onboardingAgent = {
                agentId: agentId || "",
                agentName: agentName || "",
            };
        }

        // Handle username (convert to lowercase like in registration)
        if (username !== undefined && username !== null && username.trim() !== '') {
            updateData.username = username.toLowerCase();
        }

        console.log('PUT /api/merchant/profile - merchantId:', merchantId);
        console.log('Original body username:', body.username);
        console.log('Processed username:', updateData.username);
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

        // Check username uniqueness if changed and not empty
        if (updateData.username && updateData.username.trim() !== '') {
            const existingUsername = await Partner.findOne({ username: updateData.username, _id: { $ne: merchantId } });
            if (existingUsername) {
                return NextResponse.json({ error: "Username already taken" }, { status: 400 });
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
            console.log('username after update:', updatedPartner.username);
            console.log('All fields after update:', {
                username: updatedPartner.username,
                phone: updatedPartner.phone,
                whatsapp: updatedPartner.whatsapp,
                displayName: updatedPartner.displayName
            });
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
            username: updatedPartner.username || '',
            whatsapp: updatedPartner.whatsapp,
            agentId: updatedPartner.onboardingAgent?.agentId || "",
            agentName: updatedPartner.onboardingAgent?.agentName || "",
            category: updatedPartner.category,
            city: updatedPartner.city,
            streetAddress: updatedPartner.streetAddress || "",
            pincode: updatedPartner.pincode || "",
            locality: updatedPartner.locality || "",
            state: updatedPartner.state || "",
            country: updatedPartner.country || "India",
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

        console.log('API Response username:', response.username);

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
