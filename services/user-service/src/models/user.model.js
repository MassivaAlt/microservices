const db = require('../db');

const UserModel = {
  findAll: async () => {
    const result = await db.query(
      'SELECT id, name, email, created_at AS "createdAt" FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await db.query(
      'SELECT id, name, email, created_at AS "createdAt" FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  findByEmail: async (email) => {
    const result = await db.query(
      'SELECT id, name, email, password_hash AS "passwordHash", created_at AS "createdAt" FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  create: async ({ name, email, passwordHash }) => {
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at AS "createdAt"',
      [name, email, passwordHash]
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

    if (data.email) {
      values.push(data.email);
      fields.push(`email = $${values.length}`);
    }

    if (fields.length === 0) {
      return UserModel.findById(id);
    }

    values.push(id);
    const result = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING id, name, email, created_at AS "createdAt"`,
      values
    );
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  },
};

module.exports = UserModel;