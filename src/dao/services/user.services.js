import UserDAO from "../models/user.dao.js";

const userDAO = new UserDAO();

export default class UserService {
  async getAllUsers() {
    return await userDAO.getAll();
  }

  async getUserById(id) {
    return await userDAO.getById(id);
  }

  async getUserByEmail(email) {
    return await userDAO.getByEmail(email);
  }

  async createUser(userData) {
    return await userDAO.create(userData);
  }

  async updateUser(id, updateData) {
    return await userDAO.update(id, updateData);
  }

  async deleteUser(id) {
    return await userDAO.delete(id);
  }

  async isValidId(id) {
    return await userDAO.isValidId(id);
  }
}
