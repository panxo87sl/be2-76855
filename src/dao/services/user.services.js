import UserRepository from "../../repositories/user.repository.js";

const userRepository = new UserRepository();

export default class UserService {
  async getAllUsers() {
    return await userRepository.getAll();
  }

  async getUserById(id) {
    return await userRepository.getById(id);
  }

  async getUserByEmail(email) {
    return await userRepository.getByEmail(email);
  }

  async createUser(userData) {
    return await userRepository.create(userData);
  }

  async updateUser(id, updateData) {
    return await userRepository.update(id, updateData);
  }

  async deleteUser(id) {
    return await userRepository.delete(id);
  }

  async isValidId(id) {
    return await userRepository.isValidId(id);
  }
}
