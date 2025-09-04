import { Router } from "express";

const router = Router();

router.get("/", (request, response) => {
  response.status(200).send("Hola a Todos los giles");
});

export default router;
