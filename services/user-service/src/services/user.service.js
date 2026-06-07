// user-service/src/services/user.service.js
// La logique métier est ici, séparée du controller

const UserModel = require('../models/user.model');

const UserService = {
  getAllUsers: async () => {
    return UserModel.findAll();
  },

  getUserById: async (id) => {
    const user = await UserModel.findById(id);
    if (!user) throw { status: 404, message: `User with id "${id}" not found` };
    return user;
  },

  createUser: async ({ name, email }) => {
    if (!name || !email) throw { status: 400, message: 'Name and email are required' };

    const existing = await UserModel.findByEmail(email);
    if (existing) throw { status: 409, message: `Email "${email}" is already taken` };

    return UserModel.create({ name, email });
  },

  updateUser: async (id, data) => {
    await UserService.getUserById(id);

    if (data.email) {
      const existing = await UserModel.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw { status: 409, message: `Email "${data.email}" is already taken` };
      }
    }

    const updatedUser = await UserModel.update(id, data);
    if (!updatedUser) throw { status: 404, message: `User with id "${id}" not found` };
    return updatedUser;
  },

  deleteUser: async (id) => {
    await UserService.getUserById(id);
    const deleted = await UserModel.delete(id);
    if (!deleted) throw { status: 404, message: `User with id "${id}" not found` };
    return deleted;
  },
};

module.exports = UserService;