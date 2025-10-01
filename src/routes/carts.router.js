import { Router } from "express";
import CartService from "../dao/services/cart.services.js";

const router = Router();
const cartService = new CartService();

//? Rutas para manipulación de carritos

//?GET /api/v1/carts
router.get("/", async (request, response) => {
  const carts = await cartService.getAllCarts();
  response.status(200).json({ message: "Carritos encontrados", payload: { carritos: carts } });
});

//?GET /api/v1/carts/:id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    if (!(await cartService.isValidId(id))) {
      return response
        .status(400)
        .json({ error: "ID inválido", message: "ID de carrito incorrecto" });
    }

    const cart = await cartService.getCartById(id);
    if (!cart) {
      return response
        .status(404)
        .json({ error: "Carrito no encontrado", message: "ID no existe" });
    }

    response.status(200).json({ message: "Carrito encontrado", payload: { carrito: cart } });
  } catch (error) {
    response.status(500).json({ error: "Error del servidor", message: error.message });
  }
});

//?POST /api/v1/carts
router.post("/", async (request, response) => {
  try {
    const { user } = request.body;
    if (!user) {
      return response
        .status(400)
        .json({ error: "Carrito no creado", message: "Falta el campo 'user'" });
    }

    const newCart = await cartService.createCart({ user });
    response.status(201).json({ message: "Carrito creado", payload: { carrito: newCart } });
  } catch (error) {
    response.status(500).json({ error: "Error al crear carrito", message: error.message });
  }
});

//?PUT /api/v1/carts/:id/products/:pid
router.put("/:id/products/:pid", async (request, response) => {
  try {
    const { id, pid } = request.params;
    const { quantity } = request.body;

    if (!(await cartService.isValidId(id))) {
      return response.status(400).json({ error: "ID de carrito inválido" });
    }

    const updatedCart = await cartService.addProductToCart(id, pid, quantity || 1);
    response
      .status(200)
      .json({ message: "Producto agregado al carrito", payload: { carrito: updatedCart } });
  } catch (error) {
    response.status(500).json({ error: "Error al agregar producto", message: error.message });
  }
});

//?DELETE /api/v1/carts/:id/products/:pid
router.delete("/:id/products/:pid", async (request, response) => {
  try {
    const { id, pid } = request.params;

    if (!(await cartService.isValidId(id))) {
      return response.status(400).json({ error: "ID de carrito inválido" });
    }

    const updatedCart = await cartService.removeProductFromCart(id, pid);
    response
      .status(200)
      .json({ message: "Producto eliminado del carrito", payload: { carrito: updatedCart } });
  } catch (error) {
    response.status(500).json({ error: "Error al eliminar producto", message: error.message });
  }
});

//?DELETE /api/v1/carts/:id
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    if (!(await cartService.isValidId(id))) {
      return response
        .status(400)
        .json({ error: "ID inválido", message: "ID de carrito incorrecto" });
    }

    const deleted = await cartService.deleteCart(id);
    if (!deleted) {
      return response.status(404).json({ error: "Carrito no encontrado" });
    }

    response.status(204).json(); //! Carrito eliminado correctamente - No Content
  } catch (error) {
    response.status(500).json({ error: "Error del servidor", message: error.message });
  }
});

//?DELETE /api/v1/carts/:id/products - Vaciar carrito completo
router.delete("/:id/products", async (request, response) => {
  try {
    const { id } = request.params;
    if (!(await cartService.isValidId(id))) {
      return response
        .status(400)
        .json({ error: "ID inválido", message: "ID de carrito incorrecto" });
    }

    const clearedCart = await cartService.clearCart(id);
    response
      .status(200)
      .json({ message: "Carrito vaciado", payload: { carrito: clearedCart } });
  } catch (error) {
    response.status(500).json({ error: "Error al vaciar carrito", message: error.message });
  }
});

export default router;
