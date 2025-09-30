import { Router } from "express";
import UserService from "../dao/services/user.services.js";
import {
  alreadyLoggedIn,
  requireJWT,
  requireJwtCookie,
} from "../middleware/auth.middleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();
const userService = new UserService();

router.post("/register", requireJwtCookie, async (request, response) => {
  try {
    const { first_name, last_name, email, age, password } = request.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return response
        .status(400)
        .json({ error: "Usuario no creado", message: "Datos requeridos incompletos" });
    }
    const auxUser = await userService.getUserByEmail(email);
    if (auxUser) {
      return response
        .status(400)
        .json({ error: "Usuario no creado", message: "Email ya esta registrado" });
    }
    const hash = await bcrypt.hash(password, 10); //? Hasheado a 10 caracteres
    // const user = new User({ first_name, last_name, email, age: parseInt(age), password: hash });
    // await user.save(); //? Cambio de tecnologia a DAO
    const user = await userService.createUser({
      first_name,
      last_name,
      email,
      age: parseInt(age),
      password: hash,
    });
    response.status(201).json({ message: "Usuario creado", payload: { usuario: user } });
  } catch (error) {
    response.status(500).json({ error: "Usuario no creado", message: error.message });
  }
});

router.post("/login", alreadyLoggedIn, async (request, response, next) => {
  // try {
  //   const { email, password } = request.body;
  //   if (!email || !password) {
  //     return response.status(400).json({ error: "Login Incorrecto", message: "Usuario o contraseña incorrectas" });
  //   }
  //   const auxUser = await User.findOne({ email });
  //   if (!auxUser) {
  //     return response.status(404).json({ error: "Login Incorrecto", message: "El usuario no existe" });
  //   }
  //   const valid = await bcrypt.compare(password, auxUser.password); //? Se comprara el hash password, contra el password del usuario en BD
  //   if (!valid) {
  //     return response.status(400).json({ error: "Login Incorrecto", message: "Contraseña incorrecta" });
  //   }
  //   request.session.user = {
  //     _dir: auxUser._id,
  //     first_name: auxUser.first_name,
  //     last_name: auxUser.last_name,
  //     email: auxUser.email,
  //     age: auxUser.age,
  //   };
  //   response.status(200).json({ message: "Logeado", payload: { usuario: request.session.user } });
  // } catch (error) {
  //   response.status(500).json({ error: "Login Incorrecto", message: error.message });
  // }
  //! Se cambia de estrategia de LOGIN por passport-jwt + Cookie Firmada

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return response.status(401).json({ error: info?.message || "Credenciales Invalidas" });

    request.login(user, { session: true }, (err2) => {
      if (err2) return next(err2);
      request.session.user = user; //Aqui se guarda una versión del usuario
      return response.json({ message: "Login Exitoso (Session)", user });
    });
  })(request, response, next);
});

// router.post("/logout", requireLogin, async (request, response, next) => {
//   request.session.destroy(() => {
//     response.status(200).json({ message: "Logout Exitoso" });
//   });
//   //! Se cambia de estrategia de LOGOUT por passport

//   request.logout({ keepSessionInfo: true }, (err) => {
//     if (err) return next(err);
//     //hay que destruir la session
//     if (request.session) {
//       request.session.destroy((err2) => {
//         if (err2) return next(err2);
//         //Limpiar la cookie
//         response.clearCookie("connect.sid");
//         return response.json({ message: "Logout OK" });
//       });
//     } else {
//       response.clearCookie("connect.sid");
//       return response.json({ message: "Logout OK (Sin session)" });
//     }
//   });
//   //! Se cambia de estrategia de LOGOUT por Token en cookie firmada

// });

router.post("/logout", async (request, response) => {
  const token = request.signedCookies?.token;

  if (!token) {
    return response.status(400).json({ error: "No hay sesión activa" });
  }

  response.clearCookie("token");
  response.status(200).json({ message: "Logout OK (JWT cookie eliminada)" });
});

//! Estrategia Login con GitHub
// router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
// router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/auth/github/fail" }), (req, res) => {
//   req.session.user = req.user;
//   res.json({ message: "Login OK con GitHub (session)", user: req.user });
// });
// router.get("/github/fail", (req, res) => res.status(401).json({ error: "GitHub auth falló" }));

//! Estrategia con JWT
router.post("/jwt/login", async (request, response) => {
  const { email, password } = request.body;
  const auxUser = await userService.getUserByEmail(email);
  if (!auxUser || !auxUser.password)
    return response.status(400).json({ error: "Credenciales inválidas" });
  const passwordValid = await bcrypt.compare(password, auxUser.password);
  if (!passwordValid) return response.status(401).json({ error: "Credenciales inválidas" });

  const payload = { sub: String(auxUser._id), email: auxUser.email, role: auxUser.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  // response.json({ message: "Login OK (JWT)", token });
  response
    .cookie("token", token, {
      httpOnly: true,
      signed: true, // usa req.signedCookies.token
      maxAge: 60 * 60 * 1000, // 1 hora
    })
    .json({ message: "Login OK (JWT)", token });
});

router.get("/jwt/me", requireJWT, async (request, response) => {
  // req.jwt viene del middleware
  const auxUser = await userService.getUserById(request.jwt.sub).lean();
  if (!auxUser) return response.status(404).json({ error: "No encontrado" });
  const { first_name, last_name, email, age, role } = auxUser;
  response.json({ first_name, last_name, email, age, role });
});

export default router;
