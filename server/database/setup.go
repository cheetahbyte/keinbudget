package database

import (
	"log"

	_ "github.com/mattn/go-sqlite3"

	"github.com/jmoiron/sqlx"
)

var DB *sqlx.DB

var schema = `
create table if not exists users(
	id uuid primary key,
	username text unique,
	password text,
	created_at datetime default current_timestamp
);

create table if not exists sessions(
	id uuid primary key,
	user_id uuid,
	created_at datetime default current_timestamp,
	foreign key(user_id) references users(id) on delete cascade
);
`

func SetupDatabase() {
	database, err := sqlx.Connect("sqlite3", "test.db")
	database.MustExec(schema)
	if err != nil {
		log.Fatalln(err)
	}
	DB = database
}
