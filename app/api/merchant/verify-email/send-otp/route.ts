// import { NextRequest, NextResponse } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/partner";
import sendEmail from "@/lib/nodemailer";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { merchantId } = await req.json();
    if (!merchantId) {
      return NextResponse.json({ error: "Merchant ID required" }, { status: 400 });
    }

    await dbConnect();
    const partnerQuery = Types.ObjectId.isValid(merchantId)
      ? { _id: merchantId }
      : { merchantId };

    const partner = await Partner.findOne(partnerQuery);
    
    if (!partner) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    // Check if email is already verified
    if (partner.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await Partner.updateOne(
      { _id: partner._id },
      {
        $set: {
          emailVerificationOtp: otp,
          emailVerificationOtpExpiry: otpExpiry
        }
      },
      { runValidators: false }
    );

    // Send OTP email
    await sendEmail({
      to: partner.email,
      subject: "CityWitty Merchant Hub: Email Verification OTP",
      html: `
        <div style="font-family: 'Helvetica', Arial, sans-serif; background-color:#f4f4f7; padding:20px;">
          <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background-color:#0d6efd; padding:25px; text-align:center;">
              <img src="https://partner.citywitty.com/logo2.png" alt="CityWitty Merchant Hub" width="120" style="display:block; margin:0 auto 10px;">
              <h1 style="color:#ffffff; font-size:26px; margin:0; font-weight:700;">Email Verification</h1>
            </div>

            <!-- Body -->
            <div style="padding:35px 30px; color:#333333; font-size:16px; line-height:1.6;">
              <p>Hi <strong>${partner.displayName || partner.businessName || "Merchant"}</strong>,</p>
              <p>Thank you for registering with CityWitty Merchant Hub! Please verify your email address to complete your profile setup.</p>
              
              <p>Use the OTP below to verify your email. This OTP is valid for <strong>10 minutes only</strong>.</p>

              <div style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; font-size:36px; letter-spacing:10px; background-color:#e9f2ff; padding:20px 35px; border-radius:8px; color:#0d6efd; font-weight:700; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                  ${otp}
                </span>
              </div>

              <p style="margin-top:10px;">If you did not create an account with CityWitty Merchant Hub, please ignore this email or contact our <a href="https://partner.citywitty.com/contact" style="color:#0d6efd; text-decoration:none;">support team</a>.</p>

              <p style="margin-top:30px;">Thank you,<br><strong>CityWitty Merchant Hub Team</strong></p>
            </div>

            <!-- Footer -->
            <div style="background-color:#f4f4f7; text-align:center; padding:20px; font-size:13px; color:#888888;">
              &copy; ${new Date().getFullYear()} CityWitty Merchant Hub. All rights reserved.<br>
              <a href="https://partner.citywitty.com" style="color:#0d6efd; text-decoration:none;">Visit our website</a> | 
              <a href="https://partner.citywitty.com/privacy-policy" style="color:#0d6efd; text-decoration:none;">Privacy Policy</a>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: "Verification OTP sent to your email" 
    });
  } catch (err) {
    console.error("Send Email Verification OTP Error:", err);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}