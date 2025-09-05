import { Router } from "express";
import User from "../config/models/user.model.js";
import { alreadyLoggedIn, requireLogin } from "../middleware/auth.middleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
const router = Router();

router.post("/register", alreadyLoggedIn, async (request, response) => {
  try {
    const { first_name, last_name, email, age, password } = request.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return response.status(400).json({ error: "Usuario no creado", message: "Datos requeridos incompletos" });
    }
    const auxUser = await User.findOne({ email });
    if (auxUser) {
      return response.status(400).json({ error: "Usuario no creado", message: "Email ya esta registrado" });
    }
    const hash = await bcrypt.hash(password, 10); //? Hasheado a 10 caracteres
    const user = new User({ first_name, last_name, email, age: parseInt(age), password: hash });
    await user.save();
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
  //! Se cambia de estrategia de LOGIN por passport

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return response.status(401).json({ error: info?.message || "Credenciales Invalidas" });

    request.login(user, { session: true }, (err2) => {
      if (err2) return next(err2);
      request.session.user = user; //Aqui se guarda una versión del usuario
      return response.json({ message: "Login Exitoso (Session)", user });
    });
  })(request, response, next);
});

router.post("/logout", requireLogin, async (request, response, next) => {
  // request.session.destroy(() => {
  //   response.status(200).json({ message: "Logout Exitoso" });
  // });
  //! Se cambia de estrategia de LOGOUT por passport

  request.logout({ keepSessionInfo: true }, (err) => {
    if (err) return next(err);
    //hay que destruir la session
    if (request.session) {
      request.session.destroy((err2) => {
        if (err2) return next(err2);
        //Limpiar la cookie
        response.clearCookie("connect.sid");
        return response.json({ message: "Logout OK" });
      });
    } else {
      response.clearCookie("connect.sid");
      return response.json({ message: "Logout OK (Sin session)" });
    }
  });
});

export default router;
