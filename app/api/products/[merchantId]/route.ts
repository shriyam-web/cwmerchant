import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { ProductSchema } from '@/models/partner/partner/product/product.schema';
import mongoose from 'mongoose';

const modelName = 'Product';
const ProductModel = mongoose.models[modelName] || mongoose.model(modelName, ProductSchema);

export async function POST(request: NextRequest, { params }: { params: { merchantId: string } }) {
    const { merchantId } = params;

    if (!merchantId || !Types.ObjectId.isValid(merchantId)) {
        return NextResponse.json({ error: 'Invalid merchantId' }, { status: 400 });
    }

    try {
        await dbConnect();
        const payload = await request.json();
        const product = await ProductModel.create({ ...payload, merchant: merchantId });
        return NextResponse.json({ product }, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create product', error);
        return NextResponse.json({ error: error.message ?? 'Unable to create product' }, { status: 500 });
    }
}