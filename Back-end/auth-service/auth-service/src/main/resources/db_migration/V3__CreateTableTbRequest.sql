CREATE TABLE tb_reset_tokens (
    id         BIGSERIAL PRIMARY KEY,
    token      VARCHAR(255) NOT NULL,
    expiracao  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    user_id    BIGINT NOT NULL,
    CONSTRAINT fk_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
    CONSTRAINT uq_reset_tokens_token UNIQUE (token)
);

CREATE INDEX idx_reset_tokens_user_id ON tb_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_expiracao ON tb_reset_tokens(expiracao);
