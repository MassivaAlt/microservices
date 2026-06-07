
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  price NUMERIC NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

INSERT INTO users (name, email)
VALUES
  ('Alice', 'alice@mail.com'),
  ('Bob', 'bob@mail.com')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, stock)
VALUES
  ('Laptop', 1200, 10),
  ('Phone', 800, 25),
  ('Headphones', 150, 50)
ON CONFLICT DO NOTHING;

INSERT INTO orders (user_id, product_id, quantity)
VALUES
  (
    (SELECT id FROM users ORDER BY created_at LIMIT 1),
    (SELECT id FROM products ORDER BY created_at LIMIT 1),
    2
  )
ON CONFLICT DO NOTHING;
