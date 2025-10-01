import { cartRepository } from "../../repositories/cart.repository.js";

export default class CartService {
  async getAllCarts() {
    return await cartRepository.getAll();
  }

  async getCartById(cartId) {
    return await cartRepository.getById(cartId);
  }

  async getCartByUserId(userId) {
    return await cartRepository.getByUserId(userId);
  }

  async createCart(cartData) {
    return await cartRepository.create(cartData);
  }

  async updateCart(cartId, updateData) {
    return await cartRepository.update(cartId, updateData);
  }

  async deleteCart(cartId) {
    return await cartRepository.delete(cartId);
  }

  async isValidId(id) {
    return await cartRepository.isValidId(id);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    return await cartRepository.addProduct(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return await cartRepository.removeProduct(cartId, productId);
  }

  async clearCart(cartId) {
    return await cartRepository.clearCart(cartId);
  }
}
