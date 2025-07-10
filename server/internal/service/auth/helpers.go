package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/keinbudget/backend/internal/db"
)
var Queries *db.Queries 

func findOrCreateUser(c *fiber.Ctx, username string) (db.User, error) {
	return Queries.GetUserByUsername(c.Context(), username)
}