import { Router } from "express";
import { requireJwtCookie } from "../middleware/auth.middleware.js"; // path correcto
import { UserCurrentDTO } from "../dto/user.dto.js";

const router = Router();

router.get("/current", requireJwtCookie, (request, response) => {
  const currentUser = new UserCurrentDTO(request.user); //? Implementacion de DTO

  response.status(200).json({
    message: "Usuario autenticado vía JWT (cookie)",
    // user: { //? Cambio de tecnologia a DTO
    //   id: request.user._id,
    //   first_name: request.user.first_name,
    //   last_name: request.user.last_name,
    //   email: request.user.email,
    //   age: request.user.age,
    //   role: request.user.role,
    // },

    currentUser: currentUser,
  });
});

export default router;
