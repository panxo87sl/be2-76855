import { Router } from "express";
import UserService from "../dao/services/user.services.js";
import bcrypt from "bcrypt";
import CartService from "../dao/services/cart.services.js";

const router = Router();
const userService = new UserService();
const cartService = new CartService();

//? se crean rutas alternativas para gestion mas rapida de usuarios, util para las pruebas en el desarrollo

router.get("/", async (request, response) => {
  const users = await userService.getAllUsers();
  response.status(200).json({ payload: { users: users } });
});

router.post("/", async (request, response) => {
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

    // const user = new User({ first_name, last_name, email, age: parseInt(age), password });
    // await user.save(); //? Cambio de tecnologia, se traspasa la logica a DAO capa de datos.
    const user = await userService.createUser({
      first_name,
      last_name,
      email,
      age: parseInt(age),
      password: hash,
    });
    await cartService.createCart({ user: user._id });

    response.status(201).json({ message: "Usuario creado", payload: { usuario: user } });
  } catch (error) {
    response.status(500).json({ error: "Usuario no creado", message: error.message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    if (!(await userService.isValidId(id))) {
      return response.status(400).json({ error: "Usuario no existe", message: "ID invalido" });
    }
    const auxUser = await userService.getUserById(id);
    if (!auxUser) {
      return response
        .status(404)
        .json({ error: "Usuario no existe", message: "ID no encontrado" });
    }
    response
      .status(200)
      .json({ message: "Usuario encontrado", payload: { usuario: auxUser } });
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const dataToUpdate = request.body;

    if (!(await userService.isValidId(id))) {
      return response.status(400).json({ error: "Usuario no existe", message: "ID invalido" });
    }
    const auxUser = await userService.updateUser(id, dataToUpdate, {
      new: true,
      runValidators: true,
    });
    //?findByIdAndUpdate Esto es para buscar y actualizar, {new: true, runValidators: true} esto es para guardar en la variale el dato actualizado, si no guardara el estado anterior.
    if (!auxUser) {
      return response
        .status(404)
        .json({ error: "Usuario no existe", message: "ID no encontrado" });
    }
    response
      .status(200)
      .json({ message: "Usuario actualizado", payload: { usuario: auxUser } });
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    if (!(await userService.isValidId(id))) {
      return response.status(400).json({ error: "Usuario no existe", message: "ID invalido" });
    }
    const auxUser = await userService.deleteUser(id);
    if (!auxUser) {
      return response
        .status(404)
        .json({ error: "Usuario no existe", message: "ID no encontrado" });
    }
    response.status(204).json(); //! Usuario eliminado, 204 No Content (no se envia mensaje de confirmacion)
  } catch (error) {
    response.status(500).json({ error: "Error del Servidor", message: error.message });
  }
});

export default router;
