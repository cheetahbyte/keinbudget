package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ExternalAccountsHandler struct {
	DB *sqlx.DB
}

type ExternalAccount struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type ExternalAccountDTO struct {
	Name string `json:"name"`
}

func (handler *ExternalAccountsHandler) NewExternalAccount(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(User)

	if !ok {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to retrieve user from session middleware")
	}

	var externalAccountData ExternalAccountDTO
	if err := c.BodyParser(&externalAccountData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	extAccount := ExternalAccount{
		ID:     uuid.New(),
		UserID: user.ID,
		Name:   externalAccountData.Name,
	}

	tx := handler.DB.MustBegin()
	_, err := tx.NamedExec("insert into external_accounts(id, user_id, name) values(:id, :user_id, :name)", &extAccount)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	if err = tx.Commit(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.JSON(extAccount)
}
