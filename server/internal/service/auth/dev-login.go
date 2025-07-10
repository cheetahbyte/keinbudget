package auth

import (
	"os"

	"github.com/Unleash/unleash-client-go/v4"
	"github.com/gofiber/fiber/v2"
)

func DevLogin(c *fiber.Ctx) error {
	if os.Getenv("ENV") != "dev" {
		return fiber.NewError(fiber.StatusForbidden, "Dev login not allowed")
	}
	if !unleash.IsEnabled("dev_login") {
		return fiber.NewError(fiber.StatusForbidden, "Dev login disabled by feature flag")
	}

	type request struct {
		Username string `json:"username"`
	}
	var body request
	if err := c.BodyParser(&body); err != nil || body.Username == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid username")
	}

	// Lookup user
	user, err := DB.GetUserByUsername(c.Context(), body.Username)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "User not found")
	}

	// Create session
	sess, err := Store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Session error")
	}
	sess.Set("user_id", user.ID.String())
	if err := sess.Save(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to save session")
	}

	return c.JSON(fiber.Map{
		"message": "Logged in (dev mode)",
		"user":    user.Username,
	})
}
