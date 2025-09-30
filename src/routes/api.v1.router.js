import { Router } from "express";

import homeRouter from "./home.router.js";
import userRouter from "./user.router.js";
import authRouter from "./auth.router.js";
import sessionsRouter from "./sessions.router.js";
import profileRouter from "./profile.router.js";

const router = Router({ mergeParams: true });

//Llamadas al enrutador
router.use("/", homeRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/auth/Profile", profileRouter);
router.use("/sessions", sessionsRouter);

export default router;
