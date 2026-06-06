const UserModel = require('../models/user.model');

class UserService {

  static getAllUsers() {
    return UserModel.findAll();
  }

  static getUserById(id) {
    const user = UserModel.findById(id);
    if (!user) throw new AppError(404, `User ${id} not found`);
    return user;
  }

  static createUser({ name, email }) {
    if (!name || !email) {
      throw new AppError(400, "Name and email required");
    }

    const existing = UserModel.findByEmail(email);
    if (existing) {
      throw new AppError(409, "Email already exists");
    }

    return UserModel.create({ name, email });
  }
}