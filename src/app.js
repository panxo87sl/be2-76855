import express, { request, response } from "express";
import homeRouter from "./routes/home.router.js";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import profileRouter from "./routes/profile.router.js";
import { connectAuto } from "./config/db/connect.config.js";
import logger from "./middleware/logger.middleware.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//Parametros del servidor
const app = express();
dotenv.config();
const PORT = process.env.PORT;

//Config del servidor
app.use(express.json());
app.use(logger); //middleware
app.use(cookieParser("clave_secreta"));

const startServer = async () => {
  await connectAuto();

  // const store = new MongoStore({
  //   client: (await import("mongoose")).default.connection.getClient(),
  //   ttl: 60 * 60,
  // });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "clave_secreta",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL_ATLAS,
        ttl: 60 * 60,
      }),
      cookie: {
        maxAge: 60 * 60 * 1000, //1hr
        httpOnly: true,
        signed: true, //? Para que sirve firmar la cookie?
      },
    })
  );

  //Llamadas al enrutador
  app.use("/", homeRouter);
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/auth/Profile", profileRouter);
  app.use((request, response) => {
    response.status(404).json({ error: "Pagina no encontrada" });
  });

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
};

await startServer();
