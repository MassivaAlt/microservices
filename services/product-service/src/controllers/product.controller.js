// product-service/src/controllers/product.controller.js

const ProductService = require('../services/product.service');

const ProductController = {
  getAll: async (req, res, next) => {
    try {
      const products = await ProductService.getAllProducts();
      res.json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ProductController;
