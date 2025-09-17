import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";
import sendEmail from "@/lib/nodemailer";   

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await dbConnect();
    const partner = await Partner.findOne({ email });
    if (!partner) return NextResponse.json({ error: "No merchant account associated with this email" }, { status: 404 });

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    partner.otpCode = otp;
    partner.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry
    await partner.save();

    // Send OTP email
   await sendEmail({
  to: email,
  subject: "CityWitty Merchant Hub: Password Reset OTP",
  html: `
    <div style="font-family: 'Helvetica', Arial, sans-serif; background-color:#f4f4f7; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background-color:#0d6efd; padding:25px; text-align:center;">
          <img src="https://partner.citywitty.com/logo2.png" alt="CityWitty Merchant Hub" width="120" style="display:block; margin:0 auto 10px;">
          <h1 style="color:#ffffff; font-size:26px; margin:0; font-weight:700;">CityWitty Merchant Hub</h1>
        </div>

        <!-- Body -->
        <div style="padding:35px 30px; color:#333333; font-size:16px; line-height:1.6;">
          <p>Hi <strong>${partner.name || "Merchant"}</strong>,</p>
          <p>You requested a password reset for your CityWitty Merchant Hub account. Use the OTP below to reset your password. This OTP is valid for <strong>5 minutes only</strong>.</p>

          <div style="text-align:center; margin:30px 0;">
            <span style="display:inline-block; font-size:36px; letter-spacing:10px; background-color:#e9f2ff; padding:20px 35px; border-radius:8px; color:#0d6efd; font-weight:700; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
              ${otp}
            </span>
          </div>

          <p style="margin-top:10px;">If you did not request a password reset, please contact our <a href="https://partner.citywitty.com/support" style="color:#0d6efd; text-decoration:none;">merchant support</a> immediately.</p>

          <div style="text-align:center; margin-top:25px;">
            <a href="https://partner.citywitty.com/forgot-password" style="display:inline-block; background-color:#0d6efd; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:6px; font-weight:600; font-size:16px;">Reset Password</a>
          </div>

          <p style="margin-top:30px;">Thank you,<br><strong>CityWitty Merchant Hub</strong></p>
        </div>

        <!-- Footer -->
        <div style="background-color:#f4f4f7; text-align:center; padding:20px; font-size:13px; color:#888888;">
          &copy; ${new Date().getFullYear()} CityWitty Merchant Hub. All rights reserved.<br>
          <a href="https://partner.citywitty.com" style="color:#0d6efd; text-decoration:none;">Visit our website</a> | 
          <a href="https://partner.citywitty.com/privacy" style="color:#0d6efd; text-decoration:none;">Privacy Policy</a>
        </div>
      </div>
    </div>
  `
});




    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
