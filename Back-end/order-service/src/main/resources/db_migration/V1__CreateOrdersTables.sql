CREATE TABLE IF NOT EXISTS tb_order (
    id          BIGSERIAL     PRIMARY KEY,
    order_date  TIMESTAMP     NOT NULL,
    customer_id BIGINT        NOT NULL,
    cart_id     BIGINT        UNIQUE
);