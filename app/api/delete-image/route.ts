import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
    try {
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
        }

        // Extract public_id from Cloudinary URL
        // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');

        if (uploadIndex === -1) {
            return NextResponse.json({ error: 'Invalid Cloudinary URL' }, { status: 400 });
        }

        // Get everything after 'upload/v1234567890/' (version number)
        const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');

        // Remove file extension to get public_id
        const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok' || result.result === 'not found') {
            return NextResponse.json({
                success: true,
                message: 'Image deleted successfully',
                result: result.result
            });
        } else {
            return NextResponse.json({
                error: 'Failed to delete image from Cloudinary',
                details: result
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Delete failed'
        }, { status: 500 });
    }
}