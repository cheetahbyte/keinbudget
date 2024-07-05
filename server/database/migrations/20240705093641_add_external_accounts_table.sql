-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE IF NOT EXISTS external_accounts(
	id uuid primary key,
	user_id uuid not null,
	name text not null,
	created_at datetime default current_timestamp,
	foreign key(user_id) references users(id) on delete cascade
);
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS external_accounts;
-- +goose StatementEnd
