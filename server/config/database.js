import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connection Established...");
  } catch (error) {
    console.error(error.message);
  }
}
