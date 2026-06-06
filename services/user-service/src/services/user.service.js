// user-service/src/services/user.service.js
// La logique métier est ici, séparée du controller

const UserModel = require('../models/user.model');

const UserService = {
  getAllUsers: () => {
    return UserModel.findAll();
  },

  getUserById: (id) => {
    const user = UserModel.findById(id);
    if (!user) throw { status: 404, message: `User with id "${id}" not found` };
    return user;
  },

  createUser: ({ name, email }) => {
    if (!name || !email) throw { status: 400, message: 'Name and email are required' };

    const existing = UserModel.findByEmail(email);
    if (existing) throw { status: 409, message: `Email "${email}" is already taken` };

    return UserModel.create({ name, email });
  },

  updateUser: (id, data) => {
    // On s'assure que l'utilisateur existe d'abord
    UserService.getUserById(id);

    if (data.email) {
      const existing = UserModel.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw { status: 409, message: `Email "${data.email}" is already taken` };
      }
    }

    return UserModel.update(id, data);
  },

  deleteUser: (id) => {
    UserService.getUserById(id); // Lance une erreur 404 si non trouvé
    return UserModel.delete(id);
  },
};

module.exports = UserService;