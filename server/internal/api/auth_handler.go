package api

import (
	"os"

	"github.com/keinbudget/backend/internal/service/auth"

	"github.com/gofiber/fiber/v2"
)

func RegisterAuthRoutes(app *fiber.App) {
	authGroup := app.Group("/auth")

	authGroup.Post("/register/begin", auth.BeginRegistration)
	authGroup.Post("/register/finish", auth.FinishRegistration)

	authGroup.Post("/login/begin", auth.LoginStart)
	authGroup.Post("/login/finish", auth.LoginFinish)
	if os.Getenv("ENV") == "dev" {
		authGroup.Post("/dev-login", auth.DevLogin)
	}

	authGroup.Get("/me", auth.Me)
}
