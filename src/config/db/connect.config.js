import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/backend2");
    console.log("MONGODB coenctado exitosamente");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
