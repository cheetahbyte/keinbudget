package main

import (
	"github.com/cheetahybte/keinbudget-backend/database"
	"github.com/cheetahybte/keinbudget-backend/handlers"
	"github.com/cheetahybte/keinbudget-backend/middleware/sessions"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	database.SetupDatabase()
	defer database.DB.Close()

	sessionMiddlewareConfig := sessions.Config{
		DB: database.DB,
	}

	app.Use(sessions.New(sessionMiddlewareConfig))

	userHandler := handlers.UserHandler{DB: database.DB}
	userGroup := app.Group("/users")
	{
		userGroup.Post("/", userHandler.NewUser)
		userGroup.Post("/login", userHandler.LoginUser)
	}
	app.Get("/", func(c *fiber.Ctx) error {
		var user handlers.User
		user, ok := c.Locals("user").(handlers.User)

		if !ok {
			return c.Status(fiber.StatusInternalServerError).SendString("failed to retrieve user from session middleware")
		}

		return c.SendString(user.Username)
	})

	app.Listen(":3000")
}
