import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import OfflineProduct from "@/models/OfflineProduct";

const generateOfflineProductId = () => `OFF-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const sanitizeString = (value?: string | null) => {
    if (!value) {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
};

const sanitizeStringArray = (value: unknown) => {
    if (!value) {
        return [] as string[];
    }
    if (Array.isArray(value)) {
        return value
            .map((item) => (typeof item === "string" ? item.trim() : ""))
            .filter((item) => item.length > 0);
    }
    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    }
    return [] as string[];
};

const toPositiveNumber = (value: unknown) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed) || parsed < 0) {
        return undefined;
    }
    return parsed;
};

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const url = new URL(request.url);
        const merchantId = url.searchParams.get("merchantId");

        if (!merchantId) {
            return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
        }

        const products = await OfflineProduct.find({ merchantId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error("Error fetching offline products:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch offline products",
                debug: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { merchantId, productData } = body ?? {};

        if (!merchantId || !productData) {
            return NextResponse.json({ error: "Merchant ID and product data required" }, { status: 400 });
        }

        const price = toPositiveNumber(productData.price);
        const availableStock = toPositiveNumber(productData.availableStock);
        const offerPrice = productData.offerPrice !== undefined && productData.offerPrice !== null && String(productData.offerPrice).trim().length > 0
            ? toPositiveNumber(productData.offerPrice)
            : undefined;

        if (price === undefined) {
            return NextResponse.json({ error: "Price must be a valid non-negative number" }, { status: 400 });
        }

        if (availableStock === undefined) {
            return NextResponse.json({ error: "Available stock must be a valid non-negative number" }, { status: 400 });
        }

        if (offerPrice !== undefined && offerPrice > price) {
            return NextResponse.json({ error: "Offer price cannot exceed base price" }, { status: 400 });
        }

        const status = sanitizeString(productData.status) ?? "active";
        if (!["active", "inactive"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const payload = {
            offlineProductId: sanitizeString(productData.offlineProductId) ?? generateOfflineProductId(),
            merchantId,
            productName: sanitizeString(productData.productName),
            sku: sanitizeString(productData.sku),
            category: sanitizeString(productData.category),
            description: sanitizeString(productData.description),
            price,
            offerPrice,
            availableStock,
            unit: sanitizeString(productData.unit),
            brand: sanitizeString(productData.brand),
            tags: sanitizeStringArray(productData.tags),
            imageUrls: sanitizeStringArray(productData.imageUrls),
            barcode: sanitizeString(productData.barcode),
            status,
        };

        if (!payload.productName || !payload.category || !payload.description) {
            return NextResponse.json({ error: "Product name, category, and description are required" }, { status: 400 });
        }

        const existing = await OfflineProduct.findOne({ merchantId, offlineProductId: payload.offlineProductId });
        if (existing) {
            return NextResponse.json({ error: "Offline product with this ID already exists" }, { status: 400 });
        }

        const created = await OfflineProduct.create(payload);
        return NextResponse.json({ success: true, product: created });
    } catch (error) {
        console.error("Error creating offline product:", error);
        return NextResponse.json(
            {
                error: "Failed to create offline product",
                debug: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { merchantId, offlineProductId, productData } = body ?? {};

        if (!merchantId || !offlineProductId || !productData) {
            return NextResponse.json({ error: "Merchant ID, offline product ID, and product data are required" }, { status: 400 });
        }

        const price = productData.price !== undefined ? toPositiveNumber(productData.price) : undefined;
        const availableStock = productData.availableStock !== undefined ? toPositiveNumber(productData.availableStock) : undefined;
        const offerPrice = productData.offerPrice !== undefined && productData.offerPrice !== null && String(productData.offerPrice).trim().length > 0
            ? toPositiveNumber(productData.offerPrice)
            : undefined;

        if (offerPrice !== undefined && price !== undefined && offerPrice > price) {
            return NextResponse.json({ error: "Offer price cannot exceed base price" }, { status: 400 });
        }

        const updatePayload: Record<string, unknown> = {};

        if (productData.productName !== undefined) updatePayload.productName = sanitizeString(productData.productName);
        if (productData.sku !== undefined) updatePayload.sku = sanitizeString(productData.sku);
        if (productData.category !== undefined) updatePayload.category = sanitizeString(productData.category);
        if (productData.description !== undefined) updatePayload.description = sanitizeString(productData.description);
        if (price !== undefined) updatePayload.price = price;
        if (availableStock !== undefined) updatePayload.availableStock = availableStock;
        if (offerPrice !== undefined || productData.offerPrice === "" || productData.offerPrice === null) updatePayload.offerPrice = offerPrice;
        if (productData.unit !== undefined) updatePayload.unit = sanitizeString(productData.unit);
        if (productData.brand !== undefined) updatePayload.brand = sanitizeString(productData.brand);
        if (productData.tags !== undefined) updatePayload.tags = sanitizeStringArray(productData.tags);
        if (productData.imageUrls !== undefined) updatePayload.imageUrls = sanitizeStringArray(productData.imageUrls);
        if (productData.barcode !== undefined) updatePayload.barcode = sanitizeString(productData.barcode);
        if (productData.status !== undefined) {
            const status = sanitizeString(productData.status);
            if (status && ["active", "inactive"].includes(status)) {
                updatePayload.status = status;
            }
        }

        const updated = await OfflineProduct.findOneAndUpdate(
            { merchantId, offlineProductId },
            { $set: updatePayload },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Offline product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updated });
    } catch (error) {
        console.error("Error updating offline product:", error);
        return NextResponse.json(
            {
                error: "Failed to update offline product",
                debug: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();
        const url = new URL(request.url);
        const merchantId = url.searchParams.get("merchantId");
        const offlineProductId = url.searchParams.get("offlineProductId");

        if (!merchantId || !offlineProductId) {
            return NextResponse.json({ error: "Merchant ID and offline product ID required" }, { status: 400 });
        }

        const deleted = await OfflineProduct.findOneAndDelete({ merchantId, offlineProductId });
        if (!deleted) {
            return NextResponse.json({ error: "Offline product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, offlineProductId });
    } catch (error) {
        console.error("Error deleting offline product:", error);
        return NextResponse.json(
            {
                error: "Failed to delete offline product",
                debug: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
