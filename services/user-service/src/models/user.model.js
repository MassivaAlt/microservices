// user-service/src/models/user.model.js
// Stockage en mémoire (remplacer par une vraie DB plus tard)

const { v4: uuidv4 } = require('uuid');

// Données de démo au démarrage
let users = [
  { id: uuidv4(), name: 'Alice Martin', email: 'alice@example.com', createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Bob Dupont', email: 'bob@example.com', createdAt: new Date().toISOString() },
];











const UserModel = {
  findAll: () => users,

  findById: (id) => users.find((u) => u.id === id),

  findByEmail: (email) => users.find((u) => u.email === email),

  create: ({ name, email }) => {
    const user = { id: uuidv4(), name, email, createdAt: new Date().toISOString() };
    users.push(user);
    return user;
  },

  update: (id, data) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() };
    return users[index];
  },

  delete: (id) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};

module.exports = UserModel;