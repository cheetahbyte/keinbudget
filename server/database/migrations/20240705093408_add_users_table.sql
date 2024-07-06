-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users(
	id uuid primary key,
	username text unique,
	password text,
	created_at datetime default current_timestamp
);
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
