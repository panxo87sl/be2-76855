import express from "express";
import homeRouter from "./routes/home.router.js";
import userRouter from "./routes/user.router.js";
import { connectToMongoDB } from "./config/db/connect.config.js";

const app = express();
const PORT = 3000;

//Parametros del servidor
app.use(express.json());

//Llamadas al enrutador
app.use("/", homeRouter);
app.use("/user", userRouter);

const startServer = async () => {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
};

await startServer();
