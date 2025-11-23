CREATE TABLE IF NOT EXISTS tb_cart (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_tb_cart_user_id ON tb_cart (user_id);