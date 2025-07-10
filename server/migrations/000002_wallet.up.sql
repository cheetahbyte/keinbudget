CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    start_balance MONEY NOT NULL DEFAULT 0.0,
    icon TEXT
);