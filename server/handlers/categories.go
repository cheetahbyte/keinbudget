package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CategoriesHandler struct {
	DB *sqlx.DB
}

type CategoryDTO struct {
	Name   string     `json:"name"`
	Parent *uuid.UUID `json:"parent_id"`
}

type Category struct {
	ID     uuid.UUID  `json:"id" db:"id"`
	UserID uuid.UUID  `json:"user" db:"user_id"`
	Parent *uuid.UUID `json:"parent" db:"parent_id"`
	Name   string     `json:"name" db:"name"`
}

func (handler *CategoriesHandler) NewCategory(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(User)

	if !ok {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to retrieve user from session middleware")
	}

	var data CategoryDTO
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	category := Category{
		ID:     uuid.New(),
		UserID: user.ID,
		Name:   data.Name,
	}

	tx := handler.DB.MustBegin()

	if data.Parent != nil {
		var parent Category
		err := tx.Get(&parent, "select * from categories where id = $1", data.Parent)
		if err != nil {
			tx.Rollback()
			return c.Status(404).SendString(err.Error())
		}
		category.Parent = &parent.ID
	}

	_, err := tx.NamedExec("insert into categories(id, user_id, parent_id, name) values(:id, :user_id, :parent_id, :name)", &category)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	if err = tx.Commit(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.JSON(category)
}
