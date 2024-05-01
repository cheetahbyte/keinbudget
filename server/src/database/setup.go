package database

import (
	"keinbudget/server/src/database/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func SetupDatabase(databasePath string) {
	database, err := gorm.Open(sqlite.Open(databasePath), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database")
	}

	database.AutoMigrate(&models.Transaction{})

	err = database.AutoMigrate(&models.Account{}, &models.ExternalAccount{})
	if err != nil {
		panic("Failed to migrate database")
	}

	DB = database
}
