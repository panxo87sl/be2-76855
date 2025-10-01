import { Router } from "express";
import ProductService from "../dao/services/product.services.js";

const router = Router();
const productService = new ProductService();

//? Rutas para la gestión de productos

//? GET /api/v1/products - Obtener todos los productos
router.get("/", async (request, response) => {
  try {
    const products = await productService.getAllProducts();
    response
      .status(200)
      .json({ message: "Productos encontrados", payload: { productos: products } });
  } catch (error) {
    response.status(500).json({ error: "Error del servidor", message: error.message });
  }
});

//? GET /api/v1/products/:id - Obtener un producto por ID
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    if (!(await productService.isValidId(id))) {
      return response
        .status(400)
        .json({ error: "Producto no válido", message: "ID inválido" });
    }

    const auxProduct = await productService.getProductById(id);
    if (!auxProduct) {
      return response
        .status(404)
        .json({ error: "Producto no encontrado", message: "ID no existe" });
    }

    response
      .status(200)
      .json({ message: "Producto encontrado", payload: { producto: auxProduct } });
  } catch (error) {
    response.status(500).json({ error: "Error del servidor", message: error.message });
  }
});

//? POST /api/v1/products - Crear un nuevo producto
router.post("/", async (request, response) => {
  try {
    const { title, description, price, stock, category, thumbnail } = request.body;

    if (!title || !description || !price || !stock || !category) {
      return response.status(400).json({
        error: "Producto no creado",
        message: "Faltan datos requeridos (title, description, price, stock, category)",
      });
    }

    const product = await productService.createProduct({
      title: title.trim(),
      description,
      price: Number(price),
      stock: Number(stock),
      category: category.trim(),
      thumbnail: thumbnail || "",
    });

    response.status(201).json({ message: "Producto creado", payload: { producto: product } });
  } catch (error) {
    response.status(500).json({ error: "Producto no creado", message: error.message });
  }
});

//? PUT /api/v1/products/:id - Actualizar un producto
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const dataToUpdate = request.body;

    if (!(await productService.isValidId(id))) {
      return response
        .status(400)
        .json({ error: "Producto no válido", message: "ID inválido" });
    }

    const updatedProduct = await productService.updateProduct(id, dataToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return response
        .status(404)
        .json({ error: "Producto no encontrado", message: "ID no existe" });
    }

    response
      .status(200)
      .json({ message: "Producto actualizado", payload: { producto: updatedProduct } });
  } catch (error) {
    response.status(500).json({ error: "Error del servidor", message: error.message });
  }
});

//? DELETE /api/v1/products/:id - Eliminar un producto
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    if (!(await productService.isValidId(id))) {
      return response
        .status(400)
        .json({ error: "Producto no válido", message: "ID inválido" });
    }

    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return response
        .status(404)
        .json({ error: "Producto no encontrado", message: "ID no existe" });
    }

    response.status(204).json(); //! Producto eliminado correctamente - No Content
  } catch (error) {
    response.status(500).json({ error: "Error del servidor", message: error.message });
  }
});

export default router;
