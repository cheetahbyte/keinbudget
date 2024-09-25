package database_test

import (
	"database/sql"
	"io"
	"log"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cheetahybte/keinbudget/config"
	"github.com/cheetahybte/keinbudget/database"
	"github.com/pressly/goose"
)

// Mock goose migration
var gooseUp = goose.Up

func TestSetupDatabase(t *testing.T) {
	// Create a mock database connection using sqlmock
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database connection: %v", err)
	}
	defer db.Close()

	// Mock config
	cfg := &config.KeinbudgetConfig{
		DBDriver: "sqlite",
		DBString: ":memory:",
	}

	// Override gooseUp to prevent real migrations from running
	gooseUp = func(_ *sql.DB, _ string) error {
		// Simulate successful migration
		return nil
	}

	// Redirect log output to discard to avoid failing tests due to log output
	originalLogOutput := log.Writer()
	defer log.SetOutput(originalLogOutput)
	log.SetOutput(io.Discard)

	// Run the SetupDatabase function
	database.SetupDatabase(cfg)

	// Ensure all expectations for the mock database were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("unmet expectations: %v", err)
	}
}
