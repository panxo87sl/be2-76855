import ProductDAO from "../dao/models/product.dao.js";

const productDAO = new ProductDAO();

export default class ProductRepository {
  async getAll() {
    return await productDAO.getAll();
  }

  async getById(id) {
    return await productDAO.getById(id);
  }

  async create(productData) {
    return await productDAO.create(productData);
  }

  async update(id, updateData) {
    return await productDAO.update(id, updateData);
  }

  async delete(id) {
    return await productDAO.delete(id);
  }

  async isValidId(id) {
    return await productDAO.isValidId(id);
  }
}
