// product-service/src/services/product.service.js

const ProductModel = require('../models/product.model');

const ProductService = {
  getAllProducts: async () => {
    return ProductModel.findAll();
  },

  getProductById: async (id) => {
    const product = await ProductModel.findById(id);
    if (!product) throw { status: 404, message: `Product with id "${id}" not found` };
    return product;
  },

  createProduct: async ({ name, price, description, stock }) => {
    if (!name || price === undefined) throw { status: 400, message: 'Name and price are required' };

    return ProductModel.create({ name, price, description, stock });
  },

  updateProduct: async (id, data) => {
    await ProductService.getProductById(id);
    const updatedProduct = await ProductModel.update(id, data);
    if (!updatedProduct) throw { status: 404, message: `Product with id "${id}" not found` };
    return updatedProduct;
  },

  deleteProduct: async (id) => {
    await ProductService.getProductById(id);
    const deleted = await ProductModel.delete(id);
    if (!deleted) throw { status: 404, message: `Product with id "${id}" not found` };
    return deleted;
  },
};

module.exports = ProductService;
