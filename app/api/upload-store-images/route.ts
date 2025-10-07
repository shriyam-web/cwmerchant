import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 files allowed' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Only images are allowed.');
      }

      // Validate file size (5MB limit per file)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'store-images',
            public_id: `store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    const urls = results.map((result: any) => result.secure_url);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 500 });
  }
}
