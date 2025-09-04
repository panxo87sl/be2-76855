import { Router } from "express";
import UserModel from "../config/models/user.model.js";

const router = Router();

router.get("/", async (request, respose) => {
  const users = await UserModel.find();
  respose.status(200).send(users);
});

export default router;
