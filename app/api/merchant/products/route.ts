import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/partner';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get merchant ID from auth token or query params
        const url = new URL(request.url);
        const merchantId = url.searchParams.get('merchantId');

        if (!merchantId) {
            return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
        }

        // Find partner and return embedded products
        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
        }

        return NextResponse.json({
            products: partner.products || [],
            total: partner.products?.length || 0
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { merchantId, productData } = body;

        if (!merchantId || !productData) {
            return NextResponse.json({ error: 'Merchant ID and product data required' }, { status: 400 });
        }

        // Find the partner
        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
        }

        // Create new embedded product
        const newProduct = {
            ...productData,
            productId: productData.productId || `CW-${Date.now()}`,
        };

        // Add product to partner's products array and save partner
        partner.products = partner.products || [];
        partner.products.push({
            ...newProduct,
            _id: new mongoose.Types.ObjectId(),
        });
        await partner.save({ validateModifiedOnly: true });

        return NextResponse.json({
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error saving product:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to save product'
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { merchantId, productData } = body;

        if (!merchantId || !productData || !productData.productId) {
            return NextResponse.json({ error: 'Merchant ID, product data, and product ID required' }, { status: 400 });
        }

        // Find the partner
        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
        }

        // Find and update the product
        const productIndex = partner.products?.findIndex(
            (prod: any) => prod.productId === productData.productId
        );

        if (productIndex === undefined || productIndex === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        partner.products![productIndex] = {
            ...partner.products![productIndex],
            ...productData,
        };

        await partner.save({ validateModifiedOnly: true });

        return NextResponse.json({
            message: 'Product updated successfully',
            product: partner.products![productIndex]
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to update product'
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        const url = new URL(request.url);
        const merchantId = url.searchParams.get('merchantId');
        const productId = url.searchParams.get('productId');

        if (!merchantId || !productId) {
            return NextResponse.json({ error: 'Merchant ID and Product ID required' }, { status: 400 });
        }

        const partner = await Partner.findById(merchantId);
        if (!partner) {
            return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
        }

        const productIndex = partner.products?.findIndex(
            (prod: any) => prod.productId === productId
        );

        if (productIndex === undefined || productIndex === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = partner.products![productIndex];

        // Delete images from Cloudinary
        const deleteImagePromises = product.productImages.map(async (imageUrl: string) => {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = imageUrl.split('/');
                const uploadIndex = urlParts.indexOf('upload');

                if (uploadIndex !== -1) {
                    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
                    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
                // Continue even if image deletion fails
            }
        });

        await Promise.allSettled(deleteImagePromises);

        partner.products!.splice(productIndex, 1);
        await partner.save({ validateModifiedOnly: true });

        return NextResponse.json({
            message: 'Product and images deleted successfully',
            productId
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to delete product'
        }, { status: 500 });
    }
}
