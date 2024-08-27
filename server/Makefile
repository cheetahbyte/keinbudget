.PHONY: database-migrate database-up database-down database-status start

GOOSE_DRIVER ?= sqlite3
GOOSE_DBSTRING ?= test.db

database-migrate:
	@echo "[DATABASE] Starting migration"
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING=${GOOSE_DBSTRING} goose -dir database/migrations up

database-up:
	@echo "[DATABASE] Migrating one step up"
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING=${GOOSE_DBSTRING} goose -dir database/migrations up-by-one

database-down:
	@echo "[DATABASE] Migrating one step down"
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING=${GOOSE_DBSTRING} goose -dir database/migrations down

database-status:
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING=${GOOSE_DBSTRING} goose -dir database/migrations status


database-create-migration:
	goose -dir database/migrations create ${MIGRATION_NAME} sql

start: database-migrate
	@DB_DRIVER=${GOOSE_DRIVER} DB_STRING=${GOOSE_DBSTRING} go run main.go

build:
	@CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/app cmd/main.go