const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const jwtUtil = require('../utils/jwt');

const AuthService = {
  register: async ({ name, email, password }) => {
    if (!name || !email || !password) throw { status: 400, message: 'Name, email and password are required' };

    const existing = await UserModel.findByEmail(email);
    if (existing) throw { status: 409, message: `Email "${email}" is already taken` };

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash });
    return user;
  },

  login: async ({ email, password }) => {
    if (!email || !password) throw { status: 400, message: 'Email and password are required' };

    const user = await UserModel.findByEmail(email);
    if (!user || !user.passwordHash) throw { status: 400, message: 'Invalid credentials' };

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw { status: 400, message: 'Invalid credentials' };

    const token = jwtUtil.generateToken(user);
    return token;
  },
};

module.exports = AuthService;
