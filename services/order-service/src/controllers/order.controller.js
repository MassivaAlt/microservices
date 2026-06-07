// order-service/src/controllers/order.controller.js

const OrderService = require('../services/order.service');

const OrderController = {
  getAll: async (req, res, next) => {
    try {
      const orders = await OrderService.getAllOrders();
      res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const order = await OrderService.updateOrder(req.params.id, req.body);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await OrderService.deleteOrder(req.params.id);
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = OrderController;
