
-- name: CreateCredential :exec
INSERT INTO credentials (
  id, user_id, public_key, sign_count, transports
)
VALUES ($1, $2, $3, $4, $5);

-- name: GetCredentialsByUserID :many
SELECT * FROM credentials WHERE user_id = $1;