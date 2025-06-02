import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB connected at ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Detiene la app si no se puede conectar
  }
};
