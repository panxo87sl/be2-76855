import { Router } from "express";
import { requireJwtCookie } from "../middleware/auth.middleware.js"; // path correcto
import passport from "passport";

const router = Router();

router.get("/current", requireJwtCookie, (request, response) => {
  response.status(200).json({
    message: "Usuario autenticado vía JWT (cookie)",
    user: {
      id: request.user._id,
      first_name: request.user.first_name,
      last_name: request.user.last_name,
      email: request.user.email,
      age: request.user.age,
      role: request.user.role,
    },
  });
});

export default router;
