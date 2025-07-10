package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Me(c *fiber.Ctx) error {
	sess, err := Store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Session error")
	}

	userIDStr, ok := sess.Get("user_id").(string)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "Not authenticated")
	}
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid session")
	}

	user, err := DB.GetUserByID(c.Context(), userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to load user")
	}

	return c.JSON(fiber.Map{
		"id":       user.ID,
		"username": user.Username,
	})
}
