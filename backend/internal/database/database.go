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
	_ "github.com/jackc/pgx/v5/stdlib"
)

type PGXConn struct {
	*pgx.Conn
}

func NewPGXConn(ctx context.Context, connStr string) (*PGXConn, error) {
	conn, err := pgx.Connect(ctx, connStr)
	if err != nil {
		log.Printf("Failed to connect to database")
		return nil, err
	}
	return &PGXConn{Conn: conn}, nil
}

func (p *PGXConn) Exec(ctx context.Context, sql string, arguments ...interface{}) (pgconn.CommandTag, error) {
	return p.Conn.Exec(ctx, sql, arguments...)
}

func (p *PGXConn) Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error) {
	return p.Conn.Query(ctx, sql, args...)
}

func (p *PGXConn) QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row {
	return p.Conn.QueryRow(ctx, sql, args...)
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
