package wallets

import "github.com/gofiber/fiber/v2"

func CreateWallet(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"ok": 1})
}
