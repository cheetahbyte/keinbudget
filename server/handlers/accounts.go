package handlers

import (
	"math/big"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AccountsHandler struct {
	DB *sqlx.DB
}

type Account struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Name      string    `json:"name" db:"name"`
	Balance   float32   `json:"balance" db:"balance"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type AccountDataDTO struct {
	Name    string  `json:"name"`
	Balance big.Rat `json:"balance"`
}

func (handler *AccountsHandler) NewAccount(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(User)

	if !ok {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to retrieve user from session middleware")
	}

	var accountData AccountDataDTO
	if err := c.BodyParser(&accountData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	balance, _ := accountData.Balance.Float32()
	account := Account{
		ID:        uuid.New(),
		UserID:    user.ID,
		Name:      accountData.Name,
		Balance:   balance,
		CreatedAt: time.Now(),
	}

	tx := handler.DB.MustBegin()
	_, err := tx.NamedExec("insert into accounts(id, user_id, name, balance) values(:id, :user_id, :name, :balance)", &account)

	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	if err = tx.Commit(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.JSON(account)
}
