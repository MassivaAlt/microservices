// order-service/src/services/order.service.js

const OrderModel = require('../models/order.model');

const OrderService = {
  getAllOrders: async () => {
    return OrderModel.findAll();
  },

  getOrderById: async (id) => {
    const order = await OrderModel.findById(id);
    if (!order) throw { status: 404, message: `Order with id "${id}" not found` };
    return order;
  },

  createOrder: async ({ userId, productId, quantity }) => {
    if (!userId || !productId || quantity === undefined) throw { status: 400, message: 'userId, productId and quantity are required' };

    return OrderModel.create({ userId, productId, quantity });
  },

  updateOrder: async (id, data) => {
    await OrderService.getOrderById(id);
    const updatedOrder = await OrderModel.update(id, data);
    if (!updatedOrder) throw { status: 404, message: `Order with id "${id}" not found` };
    return updatedOrder;
  },

  deleteOrder: async (id) => {
    await OrderService.getOrderById(id);
    const deleted = await OrderModel.delete(id);
    if (!deleted) throw { status: 404, message: `Order with id "${id}" not found` };
    return deleted;
  },
};

module.exports = OrderService;
