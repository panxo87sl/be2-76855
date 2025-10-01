import UserDAO from "../dao/models/user.dao.js";

const userDAO = new UserDAO();

export default class userRepository {
  async getAll() {
    return await userDAO.getAll();
  }

  async getById(id) {
    return await userDAO.getById(id);
  }

  async getByEmail(email) {
    return await userDAO.getByEmail(email);
  }

  async create(userData) {
    return await userDAO.create(userData);
  }

  async update(id, updateData) {
    return await userDAO.update(id, updateData);
  }

  async delete(id) {
    return await userDAO.delete(id);
  }

  async isValidId(id) {
    return await userDAO.isValidId(id);
  }
}
