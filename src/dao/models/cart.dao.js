import mongoose from "mongoose";
import CartModel from "../../config/models/cart.model.js";
import ProductModel from "../../config/models/product.model.js";

export default class CartDAO {
  async getAll() {
    return await CartModel.find().populate("products.product").populate("user").lean();
  }

  async getById(cartId) {
    return await CartModel.findById(cartId)
      .populate("products.product")
      .populate("user")
      .lean();
  }

  async getByUserId(userId) {
    return await CartModel.findOne({ user: userId }).populate("products.product").lean();
  }

  async create(cartData) {
    return await CartModel.create(cartData);
  }

  async update(cartId, updateData) {
    return await CartModel.findByIdAndUpdate(cartId, updateData, { new: true }).lean();
  }

  async delete(cartId) {
    return await CartModel.findByIdAndDelete(cartId).lean();
  }

  async isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    // Buscar el producto real en la base de datos
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("NOT_FOUND");

    // Validar stock antes de agregar
    if (product.stock <= 0) {
      throw new Error("NO_STOCK");
    }

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    //! Se validará al realizar la compra
    //? Descontar stock del producto
    // product.stock -= quantity;
    // await product.save();

    await cart.save();
    await cart.populate("products.product");
    return cart;
  }

  async removeProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate("products.product");
    return cart;
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    await cart.populate("products.product");
    return cart;
  }
}
