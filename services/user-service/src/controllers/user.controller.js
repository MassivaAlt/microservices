// user-service/src/controllers/user.controller.js
// Gère les requêtes HTTP, délègue la logique au service

const UserService = require('../services/user.service');

const UserController = {
  // GET /api/users
  getAll: async (req, res, next) => {
    try {
      const users = await UserService.getAllUsers();
      res.json({ success: true, count: users.length, data: users });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/users/:id
getById: async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' }); // <--- Très important pour le test 404 !
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
},

  // POST /api/users
  create: async (req, res, next) => {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/users/:id
  update: async (req, res, next) => {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/users/:id
  remove: async (req, res, next) => {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = UserController;