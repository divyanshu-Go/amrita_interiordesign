// lib/DbConnect.js
import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

/** 
 * Use global cache across hot reloads / serverless environments 
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function DbConnect() {
  if (cached.conn) {
    // Already connected
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "Amrita_Interior_Design",
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default DbConnect;
