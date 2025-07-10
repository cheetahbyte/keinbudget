package api

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterWalletRoutes(app *fiber.App) {
	walletGroup := app.Group("/wallet")
}
