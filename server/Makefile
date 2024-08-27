.PHONY: database-migrate database-up database-down database-status start

GOOSE_DRIVER ?= sqlite3
GOOSE_DBSTRING ?= test.db

migrate:
	@echo "[DATABASE] Starting migration"
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING=${GOOSE_DBSTRING} goose -dir database/migrations up

database-status:
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING=${GOOSE_DBSTRING} goose -dir database/migrations status

start: database-migrate
	@DB_DRIVER=${GOOSE_DRIVER} DB_STRING=${GOOSE_DBSTRING} go run cmd/main.go

build:
	@CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/app cmd/main.go


test:
	go test ./...