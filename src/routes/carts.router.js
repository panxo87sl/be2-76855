import { Router } from "express";
import CartService from "../dao/services/cart.services.js";
import { requireJwtCookie } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/policies.middleware.js";
import ProductService from "../dao/services/product.services.js";

const router = Router();
const cartService = new CartService();
const productService = new ProductService();

//? Rutas para manipulación de carritos

//?GET /api/v1/carts
router.get("/", async (request, response) => {
  const carts = await cartService.getAllCarts();
  response.status(200).json({ message: "Carritos encontrados", payload: { carritos: carts } });
});

//?GET /api/v1/carts/mycart
router.get("/mycart", requireJwtCookie, requireRole("user"), async (request, response) => {
  try {
    const userId = request.user._id;
    const cart = await cartService.getCartByUserId(userId);

    if (!cart) {
      return response
        .status(404)
        .json({ error: "Carrito no encontrado", message: "Este usuario no tiene carrito" });
    }

    response.status(200).json({ message: "Carrito del usuario", payload: { carrito: cart } });
  } catch (error) {
    response.status(500).json({ error: "Error del servidor", message: error.message });
  }
});
//?GET /api/v1/carts/:id
router.get("/:id", requireJwtCookie, requireRole("admin"), async (request, response) => {
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
router.post("/", requireJwtCookie, requireRole("admin"), async (request, response) => {
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

//?POST /api/v1/carts/purchase - Realizar compra del carrito actual
router.post("/purchase", requireJwtCookie, requireRole("user"), async (request, response) => {
  try {
    const userId = request.user._id;
    const userEmail = request.user.email;

    const result = await cartService.purchaseCart(userId, userEmail);

    if (!result.ticket) {
      return response.status(400).json({
        error: "Compra no realizada",
        message: "No hay productos con stock suficiente",
        productosSinStock: result.productosSinStock,
      });
    }

    response.status(200).json({
      message: "Compra realizada correctamente",
      ticket: result.ticket,
      productosSinStock: result.productosSinStock,
      productosProcesados: result.productosProcesados,
    });
  } catch (error) {
    response.status(500).json({
      error: "Error del servidor",
      message: error.message,
    });
  }
});

//?PUT /api/v1/carts/:id/products/:pid
router.put(
  "/:id/products/:pid",
  requireJwtCookie,
  requireRole("user"),
  async (request, response) => {
    try {
      const { id, pid } = request.params;
      if (!(await productService.isValidId(pid))) {
        return response.status(400).json({ error: "ID de producto inválido" });
      }
      if (!(await cartService.isValidId(id))) {
        return response.status(400).json({ error: "ID de carrito inválido" });
      }

      const updatedCart = await cartService.addProductToCart(id, pid, 1);
      response
        .status(200)
        .json({ message: "Producto agregado al carrito", payload: { carrito: updatedCart } });
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        return response.status(400).json({
          error: "Producto no encontrado",
        });
      }
      if (error.message === "NO_STOCK") {
        return response.status(400).json({
          error: "Stock insuficiente",
          message: "Este producto ya no tiene stock",
        });
      }
      response
        .status(500)
        .json({ error: "Error al agregar producto", message: error.message });
    }
  }
);

//?DELETE /api/v1/carts/:id/products/:pid - Eliminar Producto del Carrito
router.delete(
  "/:id/products/:pid",
  requireJwtCookie,
  requireRole("user"),
  async (request, response) => {
    try {
      const { id, pid } = request.params;

      if (!(await cartService.isValidId(id))) {
        return response.status(400).json({ error: "ID de carrito inválido" });
      }

      const updatedCart = await cartService.removeProductFromCart(id, pid);
      response.status(200).json({
        message: "Producto eliminado del carrito",
        payload: { carrito: updatedCart },
      });
    } catch (error) {
      response
        .status(500)
        .json({ error: "Error al eliminar producto", message: error.message });
    }
  }
);

//?DELETE /api/v1/carts/:id - Eliminar Carrito
router.delete("/:id", requireJwtCookie, requireRole("user"), async (request, response) => {
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
router.delete(
  "/:id/products",
  requireJwtCookie,
  requireRole("user"),
  async (request, response) => {
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
  }
);

export default router;
