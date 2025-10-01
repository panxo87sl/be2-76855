import { productRepository } from "../../repositories/product.repository.js";

export default class ProductService {
  async getAllProducts() {
    return await productRepository.getAll();
  }

  async getProductById(id) {
    return await productRepository.getById(id);
  }

  async createProduct(productData) {
    return await productRepository.create(productData);
  }

  async updateProduct(id, updateData) {
    return await productRepository.update(id, updateData);
  }

  async deleteProduct(id) {
    return await productRepository.delete(id);
  }

  async isValidId(id) {
    return await productRepository.isValidId(id);
  }
}
