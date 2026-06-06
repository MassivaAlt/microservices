// order-service/src/models/order.model.js

const { v4: uuidv4 } = require('uuid');

// Demo data
let orders = [
  { id: uuidv4(), userId: 'user-1', productId: 'product-1', quantity: 2, status: 'pending', createdAt: new Date().toISOString() },
  { id: uuidv4(), userId: 'user-2', productId: 'product-2', quantity: 1, status: 'completed', createdAt: new Date().toISOString() },
];

const OrderModel = {
  findAll: () => orders,

  findById: (id) => orders.find((o) => o.id === id),

  create: ({ userId, productId, quantity }) => {
    const order = { id: uuidv4(), userId, productId, quantity, status: 'pending', createdAt: new Date().toISOString() };
    orders.push(order);
    return order;
  },

  update: (id, data) => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    orders[index] = { ...orders[index], ...data, updatedAt: new Date().toISOString() };
    return orders[index];
  },

  delete: (id) => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return false;
    orders.splice(index, 1);
    return true;
  },
};

module.exports = OrderModel;
