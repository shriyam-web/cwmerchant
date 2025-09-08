import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs'; // ✅ import bcrypt

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, role } = await req.json(); // include role from frontend
    console.log("📩 Incoming login request:", { email, role });

    if (!email || !password || !role) {
      console.log("❌ Missing fields");
      return NextResponse.json(
        { message: 'Email, password, and role are required.' },
        { status: 400 }
      );
    }

    // Find user by email + role
   const user = await User.findOne({
  email: { $regex: new RegExp(`^${email}$`, 'i') },
  role,
});
    if (!user) {
      console.log("❌ No user found with this role:", role);

      // Check if email exists with another role
      const emailExists = await User.findOne({
  email: { $regex: new RegExp(`^${email}$`, 'i') },
});

      if (emailExists) {
        console.log("⚠️ Email exists but role mismatch. Correct role is:", emailExists.role);
        return NextResponse.json(
          { message: `Please select the correct account type.` },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { message: 'No account found with this email.' },
        { status: 401 }
      );
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Incorrect password for user:", email);
      return NextResponse.json({ message: 'Incorrect password.' }, { status: 401 });
    }

    console.log("✅ Login successful for:", email);

    // Success response (omit password)
    return NextResponse.json({
      _id: user._id,
      email: user.email,
      username: user.name,
      role: user.role,
    });

  } catch (err) {
    console.error('🔥 User login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
