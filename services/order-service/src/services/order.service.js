// order-service/src/services/order.service.js

const OrderModel = require('../models/order.model');

const OrderService = {
  getAllOrders: () => {
    return OrderModel.findAll();
  },

  getOrderById: (id) => {
    const order = OrderModel.findById(id);
    if (!order) throw { status: 404, message: `Order with id "${id}" not found` };
    return order;
  },

  createOrder: ({ userId, productId, quantity }) => {
    if (!userId || !productId || !quantity) throw { status: 400, message: 'userId, productId and quantity are required' };

    return OrderModel.create({ userId, productId, quantity });
  },

  updateOrder: (id, data) => {
    OrderService.getOrderById(id);
    return OrderModel.update(id, data);
  },

  deleteOrder: (id) => {
    OrderService.getOrderById(id);
    return OrderModel.delete(id);
  },
};

module.exports = OrderService;
