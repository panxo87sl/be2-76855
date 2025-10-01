import express, { request, response } from "express";
// import homeRouter from "./routes/home.router.js";
// import userRouter from "./routes/user.router.js";
// import authRouter from "./routes/auth.router.js";
// import sessionsRouter from "./routes/sessions.router.js";
// import profileRouter from "./routes/profile.router.js";
import apiV1Router from "./routes/api.v1.router.js";
import { connectAuto } from "./config/db/connect.config.js";
import logger from "./middleware/logger.middleware.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import { initPassport } from "./config/auth/passport.config.js";
import processRouter from "./routes/process.router.js";
import env, { validateEnv } from "./config/env.config.js";

//Parametros del servidor
const app = express();
dotenv.config();
const PORT = process.env.PORT;

//Config del servidor
app.use(express.json());
app.use(logger); //middleware
app.use(cookieParser(process.env.SESSION_SECRET));

const startServer = async () => {
  await connectAuto();
  //? Validar la existencia de las variables de entorno importantes
  validateEnv();

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

  initPassport();
  app.use(passport.initialize());
  app.use(passport.session());

  //Llamadas al enrutador
  // app.use("/", homeRouter);
  // app.use("/user", userRouter);
  // app.use("/auth", authRouter);
  // app.use("/auth/Profile", profileRouter);
  // app.use("/api/sessions", sessionsRouter);

  //Agrupar routers versionados
  app.use("/api/v1", apiV1Router);
  app.use("/process", processRouter);

  app.use((request, response) => {
    response.status(404).json({ error: "Pagina no encontrada" });
  });

  //? Manejo de errores globales
  process.on("unhandledRejection", (reason) => {
    console.error("[Process] Unhandled Rejection: ", reason);
  });
  process.on("uncaughtException", (error) => {
    console.error("[Process] Uncaught Exception: ", error);
  });
  process.on("SIGINT", () => {
    console.error("\n[Process] SIGINT recibido. Cerrando...");
    process.exit(0);
  });

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
};

await startServer();
