import mongoose from "mongoose";

const dbName = "coderBackend2";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
    console.log("MONGODB conectado exitosamente");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const connectToMongoDBAtlas = async () => {
  try {
    await mongoose.connect(`mongodb+srv://admin:admin1234@cluster0.bm6y9cu.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`);
    console.log("MONGOATLAS conectado exitosamente");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
