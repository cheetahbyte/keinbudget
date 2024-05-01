package main

import (
	"keinbudget/server/src/database"
	"keinbudget/server/src/handlers"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	database.SetupDatabase("gorm.db")

	accountsHandler := handlers.AccountsHandler{DB: database.DB}

	app.Post("/", accountsHandler.Create)

	app.Listen(":8080")
}
