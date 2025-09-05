import { Router } from "express";
import User from "../config/models/user.model.js";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (request, response) => {
  const users = await User.find();
  response.status(200).json({ payload: { users: users } });
});

router.post("/register", async (request, response) => {
  try {
    const { first_name, last_name, email, age, password } = request.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return response.status(400).json({ error: "Usuario no creado", message: "Datos requeridos incompletos" });
    }
    const auxUser = await User.findOne({ email });
    if (auxUser) {
      return response.status(400).json({ error: "Usuario no creado", message: "Email ya esta registrado" });
    }
    const user = new User({ first_name, last_name, email, age: parseInt(age), password });
    await user.save();
    response.status(201).json({ message: "Usuario creado", payload: { usuario: user } });
  } catch (error) {
    response.status(500).json({ error: "Usuario no creado", message: error.message });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ error: "Login Incorrecto", message: "Usuario o contraseña incorrectas" });
    }
    const auxUser = await User.findOne({ email });
    if (!auxUser) {
      return response.status(404).json({ error: "Login Incorrecto", message: "El usuario no existe" });
    }
    response.status(200).json({ message: "Logeado", payload: { usuario: auxUser } });
  } catch (error) {
    response.status(500).json({ error: "Login Incorrecto", message: error.message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ error: "Usuario no existe", message: "ID invalido" });
    }
    const auxUser = await User.findById(request.params.id);
    if (!auxUser) {
      return response.status(404).json({ error: "Usuario no existe", message: "ID no encontrado" });
    }
    response.status(200).json({ message: "Usuario encontrado", payload: { usuario: auxUser } });
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

router.put("/:id", async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ error: "Usuario no existe", message: "ID invalido" });
    }
    const auxUser = await User.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    //?findByIdAndUpdate Esto es para buscar y actualizar, {new: true, runValidators: true} esto es para guardar en la variale el dato actualizado, si no guardara el estado anterior.
    if (!auxUser) {
      return response.status(404).json({ error: "Usuario no existe", message: "ID no encontrado" });
    }
    response.status(200).json({ message: "Usuario actualizado", payload: { usuario: auxUser } });
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ error: "Usuario no existe", message: "ID invalido" });
    }
    const auxUser = await User.findByIdAndDelete(request.params.id);
    if (!auxUser) {
      return response.status(404).json({ error: "Usuario no existe", message: "ID no encontrado" });
    }
    response.status(204).json(); //? Usuario eliminado, 204 No Content (no se envia mensaje de confirmacion)
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

export default router;
