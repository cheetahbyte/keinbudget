-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE IF NOT EXISTS transactions(
	id uuid primary key,
	user_id uuid not null,
	fr_acc uuid not null,
	to_acc uuid not null,
	message text,
	balance decimal(20,2) not null,
	foreign key(user_id) references users(id) on delete cascade
);
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS transactions;
-- +goose StatementEnd
