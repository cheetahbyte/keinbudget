CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email text NOT NULL,
    password text NOT NULL
);