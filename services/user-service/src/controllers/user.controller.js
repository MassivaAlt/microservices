

const UserService = require('../services/user.service');

const UserController = {
  // GET /api/users
  getAll: (req, res, next) => {
    try {
      const users = UserService.getAllUsers();
      res.json({ success: true, count: users.length, data: users });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/users/:id
getById: (req, res, next) => {
  try {
    const user = UserService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
},

  // POST /api/users
  create: (req, res, next) => {
    try {
      const user = UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/users/:id
  update: (req, res, next) => {
    try {
      const user = UserService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/users/:id
  remove: (req, res, next) => {
    try {
      UserService.deleteUser(req.params.id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = UserController;