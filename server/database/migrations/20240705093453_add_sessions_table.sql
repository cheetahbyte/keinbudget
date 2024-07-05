-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE IF NOT EXISTS sessions(
	id uuid primary key,
	user_id uuid,
	created_at datetime default current_timestamp,
	foreign key(user_id) references users(id) on delete cascade
);
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS sessions;
-- +goose StatementEnd
