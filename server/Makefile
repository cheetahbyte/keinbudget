.PHONY: database-migrate database-up database-down database-status

GOOSE_DRIVER ?= sqlite3
GOOSE_DBSTRING ?= database.db

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