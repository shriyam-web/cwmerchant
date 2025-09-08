// export const dynamic = "force-dynamic"; // ⬅️ ensures dynamic API

// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User"; // Make sure you have a User model
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     await dbConnect(); // connect to MongoDB

//     const data = await req.json();

//     // Optional: add default role as 'user'
//     data.role = "user";

//     // Optional: hash password (if not hashed in frontend)
//     // import bcrypt from 'bcryptjs';
//     // data.password = await bcrypt.hash(data.password, 10);

//     const newUser = new User(data);
//     await newUser.save();

//     return NextResponse.json({ message: "User registered successfully" });
//   } catch (err: any) {
//     console.error("User Register API Error:", err);
//     return NextResponse.json(
//       { error: "Failed to register user", details: err.message },
//       { status: 500 }
//     );
//   }
// }
export const dynamic = "force-dynamic"; // ⬅️ ensures dynamic API

import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; 
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // ✅ import bcrypt

export async function POST(req: Request) {
  try {
    await dbConnect(); 

    const data = await req.json();

    // Default role as 'user'
    data.role = "user";

    // 🔹 Hash password
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);

    const newUser = new User(data);
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err: any) {
    console.error("User Register API Error:", err);
    return NextResponse.json(
      { error: "Failed to register user", details: err.message },
      { status: 500 }
    );
  }
}
