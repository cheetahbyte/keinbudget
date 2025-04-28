-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: CreateUser :exec
INSERT INTO users (email, password_hash) VALUES($1, $2);

-- name: CreateAccount :one
INSERT INTO accounts(user_id, name, starting_balance) VALUES($1, $2, $3) RETURNING *;

-- name: GetAccounts :many
SELECT * FROM accounts WHERE user_id = $1;