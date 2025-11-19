import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { username, merchantId } = body;

        if (!username || username.trim() === '') {
            return NextResponse.json({
                available: false,
                message: "Username is required"
            }, { status: 400 });
        }

        // Convert to lowercase for consistency
        const normalizedUsername = username.toLowerCase().trim();

        // Check if username is valid (alphanumeric and underscores only)
        if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
            return NextResponse.json({
                available: false,
                message: "Username can only contain letters, numbers, and underscores"
            }, { status: 400 });
        }

        // Check length
        if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
            return NextResponse.json({
                available: false,
                message: "Username must be between 3 and 30 characters"
            }, { status: 400 });
        }

        // Check if username is already taken (exclude current merchant if updating)
        const existingPartner = await Partner.findOne({
            username: normalizedUsername,
            ...(merchantId && { _id: { $ne: merchantId } })
        });

        if (existingPartner) {
            return NextResponse.json({
                available: false,
                message: "Username is already taken"
            });
        }

        return NextResponse.json({
            available: true,
            message: "Username is available",
            normalizedUsername
        });

    } catch (err) {
        console.error("Error checking username availability:", err);
        return NextResponse.json({
            available: false,
            message: "Failed to check username availability"
        }, { status: 500 });
    }
}