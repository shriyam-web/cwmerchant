import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "@/models/Admin";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function POST(req: Request) {
  try {
    const { username, email, password, secretCode } = await req.json();

    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return NextResponse.json({ error: "Invalid secret code" }, { status: 401 });
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({ username, email, password: hashedPassword });

    return NextResponse.json({ message: "Admin account created successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
