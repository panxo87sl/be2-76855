import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToMongoDBLocal = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log("🌿 MONGODB COMPASS conectado exitosamente");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const connectToMongoDBAtlas = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ATLAS);
    console.log("🌎 MONGOATLAS conectado exitosamente");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const connectAuto = async () => {
  const target = (process.env.MONGO_TARGET || "LOCAL").toUpperCase();
  if (target === "ATLAS") return connectToMongoDBAtlas();
  return connectToMongoDBLocal();
};
