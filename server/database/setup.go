package database

import (
	"log"

	_ "github.com/mattn/go-sqlite3"

	"github.com/jmoiron/sqlx"
)

var DB *sqlx.DB

func SetupDatabase() {
	database, err := sqlx.Connect("sqlite3", "test.db")
	if err != nil {
		log.Fatalln(err)
	}
	DB = database
}
