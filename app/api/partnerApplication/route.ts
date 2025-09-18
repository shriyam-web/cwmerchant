// // app/api/partnerApplication/route.js
// export const dynamic = "force-dynamic"; // ⬅️ Add this line
// import dbConnect from "@/lib/mongodb";
// import Partner from "@/models/Partner";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     const data = await req.json();

//     // Application ID generate on server
//     const appId = "CW-" + Math.random().toString(36).substring(2, 9).toUpperCase();
//     data.applicationId = appId;

//     const newPartner = new Partner(data);
//     await newPartner.save();

//     return NextResponse.json({ 
//       message: "Application saved", 
//       applicationId: appId 
//     });
//   } catch (err: any) {
//     console.error("API Error:", err);
//     return NextResponse.json(
//       { error: "Failed to save application", details: err.message },
//       { status: 500 }
//     );
//   }
// }


export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // 🔎 Check if email, phone, GST, or PAN already exists
    const existingPartner = await Partner.findOne({
      $or: [
        { email: data.email },
        { phone: data.phone },
        { gstNumber: data.gstNumber },
        { panNumber: data.panNumber },
      ],
    });

    if (existingPartner) {
      let conflictField = "";
      if (existingPartner.email === data.email) conflictField = "Email ID";
      else if (existingPartner.phone === data.phone) conflictField = "Phone Number";
      else if (existingPartner.gstNumber === data.gstNumber) conflictField = "GST Number";
      else if (existingPartner.panNumber === data.panNumber) conflictField = "PAN Number";

      return NextResponse.json(
        { error: `${conflictField} already exists. Please use a different one.` },
        { status: 400 }
      );
    }

    // Application ID generate
    const appId = "CW-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    data.applicationId = appId;

// Normalize email to lowercase
if (data.email) {
  data.email = data.email.toLowerCase();
}

    const newPartner = new Partner(data);
    await newPartner.save();

    return NextResponse.json({
      message: "Application saved successfully",
      applicationId: appId,
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to save application", details: err.message },
      { status: 500 }
    );
  }
}
