#!/bin/sh
GOOSE_DRIVER=${DB_DRIVER} GOOSE_DBSTRING=${DB_STRING} goose -dir database/migrations up
/app/main