// product-service/src/controllers/product.controller.js

const ProductService = require('../services/product.service');

const ProductController = {
  getAll: (req, res, next) => {
    try {
      const products = ProductService.getAllProducts();
      res.json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  },

  getById: (req, res, next) => {
    try {
      const product = ProductService.getProductById(req.params.id);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  create: (req, res, next) => {
    try {
      const product = ProductService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  update: (req, res, next) => {
    try {
      const product = ProductService.updateProduct(req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  remove: (req, res, next) => {
    try {
      ProductService.deleteProduct(req.params.id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ProductController;
