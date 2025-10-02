import { Router } from "express";

import homeRouter from "./home.router.js";
import userRouter from "./user.router.js";
import authRouter from "./auth.router.js";
import sessionsRouter from "./sessions.router.js";
import profileRouter from "./profile.router.js";
import productRouter from "./products.router.js";
import cartRouter from "./carts.router.js";
import ticketRouter from "./ticket.router.js";

const router = Router({ mergeParams: true });

//Llamadas al enrutador
router.use("/", homeRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/auth/Profile", profileRouter);
router.use("/sessions", sessionsRouter);
router.use("/products", productRouter);
router.use("/carts", cartRouter);
router.use("/tickets", ticketRouter);

export default router;
