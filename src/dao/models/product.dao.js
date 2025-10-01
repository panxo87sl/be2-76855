import ProductModel from "../../config/models/product.model.js";
import mongoose from "mongoose";

export default class ProductDAO {
  async getAll() {
    return await ProductModel.find().lean();
  }

  async getById(id) {
    return await ProductModel.findById(id).lean();
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }

  async update(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id).lean();
  }

  async isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
