import CartRepository from "../../repositories/cart.repository.js";
import TicketService from "./ticket.services.js";
import { v4 as uuidv4 } from "uuid";

const cartRepository = new CartRepository();
const ticketService = new TicketService();

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

  async purchaseCart(userId, userEmail) {
    const cart = await cartRepository.getByUserId(userId);
    if (!cart || !cart.products || cart.products.length === 0) {
      return { ticket: null, productosSinStock: [], productosProcesados: [] };
    }

    const productosProcesados = [];
    const productosSinStock = [];

    cart.products.forEach((item) => {
      const producto = item.product;
      const cantidad = item.quantity;

      if (producto.stock >= cantidad) {
        productosProcesados.push({
          _id: producto._id,
          title: producto.title,
          price: producto.price,
          quantity: cantidad,
        });
      } else {
        productosSinStock.push({
          _id: producto._id,
          title: producto.title,
          quantitySolicitada: cantidad,
          stockDisponible: producto.stock,
        });
      }
    });

    if (productosProcesados.length === 0) {
      return { ticket: null, productosSinStock, productosProcesados: [] };
    }

    const totalAmount = productosProcesados.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const ticketData = {
      code: uuidv4(),
      amount: totalAmount,
      purchaser: userEmail,
    };

    const ticket = await ticketService.createTicket(ticketData);
    await cartRepository.clearCart(cart._id); //?Vaciar el Carro despues de la compra

    return { ticket, productosSinStock, productosProcesados };
  }
}
