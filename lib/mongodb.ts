// // lib/mongodb.ts
// import mongoose from "mongoose";

// let isConnected = false; // track connection

// export default async function dbConnect() {
//   if (isConnected) return;

//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
//       dbName: "citywitty", // optional: set your DB name
//     });
//     isConnected = !!conn.connections[0].readyState;
//     console.log("✅ MongoDB connected with Mongoose");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     throw err;
//   }
// }
// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable inside .env.local");
}

// Global cache (works across hot reloads + serverless functions)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "citywitty",
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
