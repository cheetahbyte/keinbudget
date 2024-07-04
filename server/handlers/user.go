package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type UserHandler struct {
	DB *sqlx.DB
}

type User struct {
	ID        uuid.UUID `db:"id"`
	Username  string    `json:"usernane" db:"username"`
	Password  string    `json:"password" db:"password"`
	CreatedAt string    `json:"created_at" db:"created_at"`
}

type Session struct {
	ID        uuid.UUID `db:"id"`
	UserID    uuid.UUID `db:"user_id"`
	CreatedAt string    `db:"createdAt"`
}

type UserDataDTO struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (handler *UserHandler) NewUser(c *fiber.Ctx) error {
	var userData UserDataDTO

	if err := c.BodyParser(&userData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	if userData.Username == "" || userData.Password == "" {
		return c.Status(fiber.StatusUnprocessableEntity).SendString("no password or username specified")
	}

	tx := handler.DB.MustBegin()

	user := User{ID: uuid.New(), Username: userData.Username, Password: userData.Password}
	_, err := tx.Exec("insert into users (id, username, password) values($1, $2, $3);", user.ID, user.Username, user.Password)

	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusConflict).SendString(err.Error())
	}

	if err := tx.Commit(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return nil
}

func (handler *UserHandler) LoginUser(c *fiber.Ctx) error {
	var loginData UserDataDTO

	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	var foundUser User

	err := handler.DB.Get(&foundUser, "select * from users where username=$1", loginData.Username)

	if err != nil {
		return c.Status(fiber.StatusNotFound).SendString(err.Error())
	}

	if loginData.Password != foundUser.Password {
		return c.Status(fiber.StatusUnauthorized).SendString("passwords not matching")
	}

	session := Session{
		ID:     uuid.New(),
		UserID: foundUser.ID,
	}

	tx := handler.DB.MustBegin()
	_, err = tx.NamedExec("insert into sessions(id, user_id) values(:id, :user_id)", &session)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	tx.Commit()

	keks := fiber.Cookie{
		Name:    "session",
		Value:   session.ID.String(),
		Expires: time.Now().Add(24 * time.Hour),
	}

	c.Cookie(&keks)
	c.Response().Header.Add("Content-Type", "application/json")
	return c.SendString("{ok: 1}")
}
