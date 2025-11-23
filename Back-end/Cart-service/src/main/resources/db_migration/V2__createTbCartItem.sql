 CREATE TABLE IF NOT EXISTS tb_cart_item (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES tb_cart(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price NUMERIC(14,2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  converted_price NUMERIC(14,2)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_tb_cart_item_cart_product ON tb_cart_item (cart_id, product_id);
