package database

import (
	"log"

	"github.com/cheetahybte/keinbudget-backend/config"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sqlx.DB

func SetupDatabase(cfg *config.KeinbudgetConfig) {
	database, err := sqlx.Connect(cfg.DBDriver, cfg.DBString)
	if err != nil {
		log.Fatalln(err)
	}
	DB = database
}
