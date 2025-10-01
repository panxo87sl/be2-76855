import CartModel from "../../config/models/cart.model.js";
import mongoose from "mongoose";

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

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return await cart.populate("products.product").execPopulate();
  }

  async removeProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter((item) => item.product.toString() !== productId);
    await cart.save();
    return await cart.populate("products.product").execPopulate();
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return await cart.populate("products.product").execPopulate();
  }
}
