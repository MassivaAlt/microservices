// order-service/src/controllers/order.controller.js

const OrderService = require('../services/order.service');

const OrderController = {
  getAll: (req, res, next) => {
    try {
      const orders = OrderService.getAllOrders();
      res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      next(err);
    }
  },

  getById: (req, res, next) => {
    try {
      const order = OrderService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  create: (req, res, next) => {
    try {
      const order = OrderService.createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  update: (req, res, next) => {
    try {
      const order = OrderService.updateOrder(req.params.id, req.body);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  remove: (req, res, next) => {
    try {
      OrderService.deleteOrder(req.params.id);
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = OrderController;
