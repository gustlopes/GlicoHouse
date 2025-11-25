DROP TABLE IF EXISTS tb_product;

CREATE TABLE IF NOT EXISTS tb_product (
    id            SERIAL       NOT NULL,
    description   VARCHAR(100) NOT NULL,
    brand         VARCHAR(255) NOT NULL,
    model         VARCHAR(255) NOT NULL,
    currency      VARCHAR(3)   NOT NULL,
    price         FLOAT(53)    NOT NULL,
    stock         INTEGER      NOT NULL,
    needs_prescription BOOLEAN  NOT NULL,
   	especificacao TEXT,
    como_usar     TEXT,
    image_url     TEXT         NOT NULL,
    PRIMARY KEY (id)
);
