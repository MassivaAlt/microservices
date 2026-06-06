// product-service/src/models/product.model.js

const { v4: uuidv4 } = require('uuid');

// Demo data
let products = [
  { id: uuidv4(), name: 'Laptop', price: 999.99, description: 'High-performance laptop', createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Mouse', price: 29.99, description: 'Wireless mouse', createdAt: new Date().toISOString() },
];

const ProductModel = {
  findAll: () => products,

  findById: (id) => products.find((p) => p.id === id),

  create: ({ name, price, description }) => {
    const product = { id: uuidv4(), name, price, description, createdAt: new Date().toISOString() };
    products.push(product);
    return product;
  },

  update: (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
    return products[index];
  },

  delete: (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};

module.exports = ProductModel;
