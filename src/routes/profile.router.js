import { Router } from "express";
import { requireJwtCookie, requireLogin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireLogin, (request, response) => {
  const { first_name, last_name, email, age } = request.session.user;

  response.status(200).json({
    user: {
      first_name,
      last_name,
      email,
      age,
    },
  });
});

export default router;
