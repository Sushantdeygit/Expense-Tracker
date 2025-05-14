import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI_PROD ?? process.env.MONGO_URI_LOCAL;

export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGO_URI as string);
  console.log("MongoDB connected");
}
