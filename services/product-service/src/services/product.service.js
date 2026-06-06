// product-service/src/services/product.service.js

const ProductModel = require('../models/product.model');

const ProductService = {
  getAllProducts: () => {
    return ProductModel.findAll();
  },

  getProductById: (id) => {
    const product = ProductModel.findById(id);
    if (!product) throw { status: 404, message: `Product with id "${id}" not found` };
    return product;
  },

  createProduct: ({ name, price, description }) => {
    if (!name || !price) throw { status: 400, message: 'Name and price are required' };

    return ProductModel.create({ name, price, description });
  },

  updateProduct: (id, data) => {
    ProductService.getProductById(id);
    return ProductModel.update(id, data);
  },

  deleteProduct: (id) => {
    ProductService.getProductById(id);
    return ProductModel.delete(id);
  },
};

module.exports = ProductService;
