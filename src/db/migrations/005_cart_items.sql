CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL CHECK (quantity >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, product_id) /*same product can only appear once in a given cart*/
);