package handlers

import (
	"keinbudget/server/src/database/models"
	"keinbudget/server/src/dto"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type AccountsHandler struct {
	DB *gorm.DB
}

func (handler *AccountsHandler) Create(c *fiber.Ctx) error {
	data := new(dto.AccountCreate)
	if err := c.BodyParser(data); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"error": "Something went wrong"})
	}

	account := models.Account{
		Name: data.Name,
		Iban: data.Iban,
	}

	handler.DB.Create(&account)
	return c.JSON(account)
}
