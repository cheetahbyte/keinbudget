CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE credentials (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  public_key BYTEA NOT NULL,
  sign_count BIGINT NOT NULL,
  transports TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);