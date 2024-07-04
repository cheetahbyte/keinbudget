package main

import (
	"github.com/cheetahybte/keinbudget-backend/database"
	"github.com/cheetahybte/keinbudget-backend/handlers"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	database.SetupDatabase()
	defer database.DB.Close()

	userHandler := handlers.UserHandler{DB: database.DB}
	userGroup := app.Group("/users")
	{
		userGroup.Post("/", userHandler.NewUser)
		userGroup.Post("/login", userHandler.LoginUser)
	}

	app.Listen(":3000")
}
