import UserModel from "../../config/models/user.model.js";
import mongoose from "mongoose";

export default class UserDAO {
  async getAll() {
    return await UserModel.find().lean(); //? devuelve todos los usuarios
  }

  async getById(id) {
    return await UserModel.findById(id).lean(); //? buscar usuario por ID
  }

  async getByEmail(email) {
    return await UserModel.findOne({ email }).lean(); //? buscar usuario por correo
  }

  async create(userData) {
    return await UserModel.create(userData); //? crear un nuevo usuario
  }

  async update(id, updateData) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true }); //? actualizar usuario
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id); //? eliminar usuario
  }

  async isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
