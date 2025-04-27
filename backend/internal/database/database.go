package database

import (
	"context"
	"database/sql"
	"log"

	"github.com/cheetahbyte/keinbudget/backend/internal/config"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type PGXPool struct {
	*pgxpool.Pool
}

func NewPGXPool(ctx context.Context, connStr string) (*PGXPool, error) {
	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		log.Printf("Failed to create connection pool")
		return nil, err
	}
	err = pool.Ping(ctx)
	if err != nil {
		log.Printf("Failed to ping database")
		return nil, err
	}
	return &PGXPool{Pool: pool}, nil
}

func (p *PGXPool) Exec(ctx context.Context, sql string, arguments ...interface{}) (pgconn.CommandTag, error) {
	return p.Pool.Exec(ctx, sql, arguments...)
}

func (p *PGXPool) Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error) {
	return p.Pool.Query(ctx, sql, args...)
}

func (p *PGXPool) QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row {
	return p.Pool.QueryRow(ctx, sql, args...)
}

func (p *PGXPool) Close(ctx context.Context) {
	p.Pool.Close()
}

func RunMigrations(cfg *config.Config) error {
	db, err := sql.Open("pgx", cfg.DatabaseUrl)
	if err != nil {
		return err
	}
	defer db.Close()

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return err
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://internal/database/migrations",
		"postgres", driver)
	if err != nil {
		return err
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return err
	}

	return nil
}
