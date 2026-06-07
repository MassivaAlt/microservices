const db = require('../db');

const mapOrderRow = (row) => ({
  id: row.id,
  quantity: row.quantity,
  status: row.status,
  createdAt: row.createdAt,
  user: {
    id: row.userId,
    name: row.userName,
    email: row.userEmail,
  },
  product: {
    id: row.productId,
    name: row.productName,
    price: row.productPrice,
    stock: row.productStock,
  },
});

const OrderModel = {
  findAll: async () => {
    const result = await db.query(
      `SELECT
        o.id,
        o.user_id AS "userId",
        o.product_id AS "productId",
        o.quantity,
        o.status,
        o.created_at AS "createdAt",
        u.name AS "userName",
        u.email AS "userEmail",
        p.name AS "productName",
        p.price AS "productPrice",
        p.stock AS "productStock"
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN products p ON p.id = o.product_id
      ORDER BY o.created_at DESC`
    );
    return result.rows.map(mapOrderRow);
  },

  findById: async (id) => {
    const result = await db.query(
      `SELECT
        o.id,
        o.user_id AS "userId",
        o.product_id AS "productId",
        o.quantity,
        o.status,
        o.created_at AS "createdAt",
        u.name AS "userName",
        u.email AS "userEmail",
        p.name AS "productName",
        p.price AS "productPrice",
        p.stock AS "productStock"
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN products p ON p.id = o.product_id
      WHERE o.id = $1`,
      [id]
    );
    return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
  },

  create: async ({ userId, productId, quantity, status }) => {
    const result = await db.query(
      'INSERT INTO orders (user_id, product_id, quantity, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, productId, quantity, status || 'pending']
    );
    return OrderModel.findById(result.rows[0].id);
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.quantity !== undefined) {
      values.push(data.quantity);
      fields.push(`quantity = $${values.length}`);
    }
    if (data.status !== undefined) {
      values.push(data.status);
      fields.push(`status = $${values.length}`);
    }

    if (fields.length === 0) {
      return OrderModel.findById(id);
    }

    values.push(id);
    await db.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = $${values.length}`, values);
    return OrderModel.findById(id);
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  },
};

module.exports = OrderModel;
