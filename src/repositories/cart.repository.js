import CartDAO from "../dao/models/cart.dao.js";

const cartDAO = new CartDAO();

export default class CartRepository {
  async getAll() {
    return await cartDAO.getAll();
  }

  async getById(cartId) {
    return await cartDAO.getById(cartId);
  }

  async getByUserId(userId) {
    return await cartDAO.getByUserId(userId);
  }

  async create(cartData) {
    return await cartDAO.create(cartData);
  }

  async update(cartId, updateData) {
    return await cartDAO.update(cartId, updateData);
  }

  async delete(cartId) {
    return await cartDAO.delete(cartId);
  }

  async isValidId(id) {
    return await cartDAO.isValidId(id);
  }

  async addProduct(cartId, productId, quantity = 1) {
    return await cartDAO.addProduct(cartId, productId, quantity);
  }

  async removeProduct(cartId, productId) {
    return await cartDAO.removeProduct(cartId, productId);
  }

  async clearCart(cartId) {
    return await cartDAO.clearCart(cartId);
  }
}
