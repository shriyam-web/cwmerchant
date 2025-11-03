// app/api/application/[merchantId]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import type { IPartner } from "@/models/partner/partner.interface";

export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: { merchantId: string } }
) {
    try {
        await dbConnect();

        const { merchantId } = params;

        if (!merchantId) {
            return NextResponse.json(
                { error: "Merchant ID is required" },
                { status: 400 }
            );
        }

        // Find partner by merchantId field
        const partner = await Partner.findOne({ merchantId }).lean() as IPartner | null;

        if (!partner) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        // Define profile fields to check
        const profileFields = [
            { key: "legalName", label: "Legal Name", category: "Basic Info" },
            { key: "displayName", label: "Display Name", category: "Basic Info" },
            { key: "email", label: "Email", category: "Contact" },
            { key: "emailVerified", label: "Email Verification", category: "Verification" },
            { key: "phone", label: "Phone", category: "Contact" },
            { key: "category", label: "Business Category", category: "Basic Info" },
            { key: "city", label: "City", category: "Location" },
            { key: "streetAddress", label: "Street Address", category: "Location" },
            { key: "pincode", label: "Pincode", category: "Location" },
            { key: "locality", label: "Locality", category: "Location" },
            { key: "state", label: "State", category: "Location" },
            { key: "whatsapp", label: "WhatsApp", category: "Contact" },
            { key: "gstNumber", label: "GST Number", category: "Legal" },
            { key: "panNumber", label: "PAN Number", category: "Legal" },
            { key: "businessType", label: "Business Type", category: "Business Details" },
            { key: "yearsInBusiness", label: "Years in Business", category: "Business Details" },
            { key: "averageMonthlyRevenue", label: "Monthly Revenue", category: "Business Details" },
            { key: "description", label: "Description", category: "Business Details" },
            { key: "website", label: "Website", category: "Online Presence", optional: true },
            { key: "socialLinks.linkedin", label: "LinkedIn", category: "Social Media", optional: true },
            { key: "socialLinks.instagram", label: "Instagram", category: "Social Media", optional: true },
            { key: "socialLinks.facebook", label: "Facebook", category: "Social Media", optional: true },
            { key: "businessHours.open", label: "Business Hours (Open)", category: "Operations" },
            { key: "businessHours.close", label: "Business Hours (Close)", category: "Operations" },
            { key: "businessHours.days", label: "Business Days", category: "Operations" },
            { key: "logo", label: "Logo", category: "Media" },
            { key: "storeImages", label: "Store Images", category: "Media" },
            { key: "mapLocation", label: "Map Location", category: "Location", optional: true },
            { key: "bankDetails.accountNumber", label: "Bank Account Number", category: "Banking" },
            { key: "bankDetails.ifscCode", label: "IFSC Code", category: "Banking" },
            { key: "bankDetails.accountHolderName", label: "Account Holder Name", category: "Banking" },
        ];

        // Helper to get nested values
        const getNestedValue = (obj: any, path: string) => {
            return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
        };

        // Check missing fields
        const missingFields: any[] = [];
        const completedFields: any[] = [];

        for (const field of profileFields) {
            const value = getNestedValue(partner, field.key);

            let isMissing = false;

            if (value === undefined || value === null) {
                isMissing = true;
            } else if (Array.isArray(value) && value.length === 0) {
                isMissing = true;
            } else if (typeof value === "string" && value.trim() === "") {
                isMissing = true;
            } else if (typeof value === "boolean" && field.key === "emailVerified" && value === false) {
                isMissing = true;
            }

            if (isMissing && !field.optional) {
                missingFields.push({
                    key: field.key,
                    label: field.label,
                    category: field.category,
                });
            } else if (!isMissing) {
                completedFields.push({
                    key: field.key,
                    label: field.label,
                    category: field.category,
                });
            }
        }

        // Calculate completion percentage
        const requiredFieldsCount = profileFields.filter(f => !f.optional).length;
        const completedRequiredCount = requiredFieldsCount - missingFields.length;
        const completionPercentage = Math.round((completedRequiredCount / requiredFieldsCount) * 100);

        // Group missing fields by category
        const groupedMissingFields = missingFields.reduce((acc: any, field) => {
            if (!acc[field.category]) {
                acc[field.category] = [];
            }
            acc[field.category].push(field);
            return acc;
        }, {});

        // Determine next steps based on status and missing fields
        const nextSteps: string[] = [];

        if (partner.status === "pending") {
            if (!partner.emailVerified) {
                nextSteps.push("Verify your email address");
            }
            if (missingFields.length > 0) {
                nextSteps.push("Complete your profile information");
            }
            if (!partner.logo) {
                nextSteps.push("Upload your business logo");
            }
            if (!partner.storeImages || partner.storeImages.length === 0) {
                nextSteps.push("Add store images");
            }
            if (!partner.bankDetails?.accountNumber) {
                nextSteps.push("Add bank account details");
            }
            if (nextSteps.length === 0) {
                nextSteps.push("Your application is under review");
            }
        } else if (partner.status === "active") {
            if (completionPercentage < 100) {
                nextSteps.push("Complete remaining profile fields for better visibility");
            }
            if (!partner.products || partner.products.length === 0) {
                nextSteps.push("Add your first product");
            }
            nextSteps.push("Your profile is live and visible to customers");
        } else if (partner.status === "suspended") {
            nextSteps.push("Contact support to resolve suspension");
            if (partner.suspensionReason) {
                nextSteps.push(`Reason: ${partner.suspensionReason}`);
            }
        } else if (partner.status === "inactive") {
            nextSteps.push("Your account is inactive");
            nextSteps.push("Contact support to reactivate");
        }

        // Create response
        const response = {
            merchantId: partner.merchantId,
            displayName: partner.displayName,
            legalName: partner.legalName,
            email: partner.email,
            status: partner.status,
            emailVerified: partner.emailVerified,
            joinedSince: partner.joinedSince,
            completionPercentage,
            missingFieldsCount: missingFields.length,
            completedFieldsCount: completedFields.length,
            totalRequiredFields: requiredFieldsCount,
            missingFields: groupedMissingFields,
            nextSteps,
            profileDetails: {
                category: partner.category,
                city: partner.city,
                state: partner.state,
                phone: partner.phone,
                hasLogo: !!partner.logo,
                hasStoreImages: partner.storeImages && partner.storeImages.length > 0,
                storeImagesCount: partner.storeImages?.length || 0,
                hasProducts: partner.products && partner.products.length > 0,
                productsCount: partner.products?.length || 0,
                visibility: partner.visibility,
                citywittyAssured: partner.citywittyAssured,
                isVerified: partner.isVerified,
                purchasedPackage: partner.purchasedPackage?.variantName || null,
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching application status:", error);
        return NextResponse.json(
            { error: "Failed to fetch application status" },
            { status: 500 }
        );
    }
}