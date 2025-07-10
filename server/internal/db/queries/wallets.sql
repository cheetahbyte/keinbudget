-- name: GetWallets :many
SELECT * FROM wallets WHERE user_id = $1;

-- name: CreateWallet :one
INSERT INTO wallets (name, start_balance, user_id, icon) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetWallet :one
SELECT * FROM wallets WHERE user_id = $1 AND id = $2;