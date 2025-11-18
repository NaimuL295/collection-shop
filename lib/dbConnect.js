const mongoose =require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define MONGODB_URI in your environment variables.");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "store",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      console.log("✅ MongoDB connected!");
      return mongoose;
    }).catch((err) => {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
