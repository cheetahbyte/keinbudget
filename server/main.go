package main

import (
	"github.com/cheetahybte/keinbudget-backend/database"
	"github.com/cheetahybte/keinbudget-backend/handlers"
	"github.com/gofiber/fiber/v2"
)

func handler(c *fiber.Ctx) error {
	result := c.Query("foo")
	println(result)
	c.SendString("You said: " + result)
	return nil
}

func main() {
	app := fiber.New()

	database.SetupDatabase()
	defer database.DB.Close()

	// create handlers
	userHandler := handlers.UserHandler{DB: database.DB}
	userGroup := app.Group("/users")
	{
		userGroup.Post("/", userHandler.NewUser)
		userGroup.Post("/login", userHandler.LoginUser)
	}

	// mount routes

	app.Get("/", handler)

	// start app

	app.Listen(":3000")
}
