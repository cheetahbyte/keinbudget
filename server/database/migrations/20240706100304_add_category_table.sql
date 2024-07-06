-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE IF NOT EXISTS categories(
    id UUID PRIMARY KEY,
    user_id UUID,
    parent_id UUID,
    name TEXT,
    foreign key(user_id) references users(id) on delete cascade
    foreign key(parent_id) references categories(id) on delete cascade
);
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS categories;
-- +goose StatementEnd
