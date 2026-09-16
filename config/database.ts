import mongoose from "mongoose";

let connected = false;

const connectDB = async (): Promise<void> => {
  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }

  console.log("Connecting to MongoDB...");

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    connected = true;
    console.log("MongoDB connected...");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
