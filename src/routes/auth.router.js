import { Router } from "express";
import User from "../config/models/user.model.js";
import { alreadyLoggedIn, requireLogin } from "../middleware/auth.middleware.js";
import bcrypt from "bcrypt";

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

router.post("/login", alreadyLoggedIn, async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ error: "Login Incorrecto", message: "Usuario o contraseña incorrectas" });
    }
    const auxUser = await User.findOne({ email });
    if (!auxUser) {
      return response.status(404).json({ error: "Login Incorrecto", message: "El usuario no existe" });
    }
    const valid = await bcrypt.compare(password, auxUser.password); //? Se comprara el hash password, contra el password del usuario en BD
    if (!valid) {
      return response.status(400).json({ error: "Login Incorrecto", message: "Contraseña incorrecta" });
    }
    request.session.user = {
      _dir: auxUser._id,
      first_name: auxUser.first_name,
      last_name: auxUser.last_name,
      email: auxUser.email,
      age: auxUser.age,
    };
    response.status(200).json({ message: "Logeado", payload: { usuario: request.session.user } });
  } catch (error) {
    response.status(500).json({ error: "Login Incorrecto", message: error.message });
  }
});

router.post("/logout", requireLogin, async (request, response) => {
  request.session.destroy(() => {
    response.status(200).json({ message: "Logout Exitoso" });
  });
});

export default router;
