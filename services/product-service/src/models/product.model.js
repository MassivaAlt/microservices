const db = require('../db');

const ProductModel = {
  findAll: async () => {
    const result = await db.query(
      'SELECT id, name, price, stock, created_at AS "createdAt" FROM products ORDER BY created_at DESC'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await db.query(
      'SELECT id, name, price, stock, created_at AS "createdAt" FROM products WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  create: async ({ name, price, description, stock }) => {
    const result = await db.query(
      'INSERT INTO products (name, price, stock, description) VALUES ($1, $2, $3, $4) RETURNING id, name, price, stock, created_at AS "createdAt"',
      [name, price, stock || 0, description || null]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name) {
      values.push(data.name);
      fields.push(`name = $${values.length}`);
    }
    if (data.price !== undefined) {
      values.push(data.price);
      fields.push(`price = $${values.length}`);
    }
    if (data.stock !== undefined) {
      values.push(data.stock);
      fields.push(`stock = $${values.length}`);
    }
    if (data.description !== undefined) {
      values.push(data.description);
      fields.push(`description = $${values.length}`);
    }

    if (fields.length === 0) {
      return ProductModel.findById(id);
    }

    values.push(id);
    const result = await db.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING id, name, price, stock, created_at AS "createdAt"`,
      values
    );
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  },
};

module.exports = ProductModel;
