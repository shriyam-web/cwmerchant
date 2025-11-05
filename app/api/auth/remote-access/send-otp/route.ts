import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RemoteAccessOTP } from '@/models/RemoteAccessOTP';
import sendEmail from '@/lib/nodemailer';

const ADMIN_EMAIL = process.env.REMOTE_ACCESS_ADMIN_EMAIL;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized email address' },
        { status: 403 }
      );
    }

    await connectDB();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email and create new one
    await RemoteAccessOTP.findOneAndDelete({ email });
    await RemoteAccessOTP.create({
      email,
      otp,
      expiresAt,
    });

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: 'CityWitty Remote Access - OTP Verification',
      text: `Your OTP for remote access login is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">CityWitty Remote Access</h2>
          <p>Your OTP for remote access login is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #6b7280;">This OTP will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #ef4444; font-size: 14px;">⚠️ If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600, // seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}