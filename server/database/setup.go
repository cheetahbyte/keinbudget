package database

import (
	"log"

	"github.com/cheetahybte/keinbudget/config"
	"github.com/jmoiron/sqlx"
	"github.com/pressly/goose"
	_ "modernc.org/sqlite"
)

var DB *sqlx.DB

func SetupDatabase(cfg *config.KeinbudgetConfig) {
	database, err := sqlx.Connect(cfg.DBDriver, cfg.DBString)
	if err != nil {
		log.Fatalln(err)
	}

	goose.Up(database.DB, "database/migrations")
	if err != nil {
		log.Fatalln(err)
	}
	DB = database
}
