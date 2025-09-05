import express from "express";
import homeRouter from "./routes/home.router.js";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import profileRouter from "./routes/profile.router.js";
import { connectToMongoDB, connectToMongoDBAtlas } from "./config/db/connect.config.js";
import logger from "./middleware/logger.middleware.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

//Parametros del servidor
const app = express();
const PORT = 3000;
const ATLAS_URL = "mongodb+srv://admin:admin1234@cluster0.bm6y9cu.mongodb.net/";

//Config del servidor
app.use(express.json());
app.use(logger); //middleware
app.use(cookieParser("clave_secreta"));
app.use(
  session({
    secret: "clave_secreta",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: ATLAS_URL,
      ttl: 60 * 60,
    }),
    cookie: {
      maxAge: 60 * 60 * 1000, //1hr
      httpOnly: true,
      signed: true,
    },
  })
);

//Llamadas al enrutador
app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/auth/Profile", profileRouter);

const ATLAS = true; //?Aqui elijo a que base conectarme true = ATLAS (nube), false = COMPASS (local)
const startServer = async () => {
  ATLAS ? await connectToMongoDBAtlas() : await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
};

await startServer();
