import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/partner';
import { ProductSchema } from '@/models/partner/product/product.schema';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get merchant ID from auth token or query params
        const url = new URL(request.url);
        const merchantId = url.searchParams.get('merchantId');

        if (!merchantId) {
            return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
        }

        // Find partner and populate products
        const partner = await Partner.findById(merchantId).populate('products');
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

        // Create new product
        const newProduct = new Product({
            ...productData,
            productId: productData.productId || `CW-${Date.now()}`,
        });

        // Save the product
        const savedProduct = await newProduct.save();

        // Add product to partner's products array
        partner.products = partner.products || [];
        partner.products.push(savedProduct._id);
        await partner.save();

        return NextResponse.json({
            message: 'Product added successfully',
            product: savedProduct
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
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productData.productId },
            { $set: productData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Product updated successfully',
            product: updatedProduct
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

        // Find the product
        const product = await Product.findOne({ productId });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

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

        // Remove product reference from partner
        const partner = await Partner.findById(merchantId);
        if (partner) {
            partner.products = partner.products?.filter(
                (pid: any) => pid.toString() !== product._id.toString()
            ) || [];
            await partner.save();
        }

        // Delete the product from database
        await Product.findByIdAndDelete(product._id);

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
