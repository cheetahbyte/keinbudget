package sessions

import (
	"errors"
	"time"

	"github.com/cheetahybte/keinbudget-backend/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

type Config struct {
	ExcludedPaths []string
	DB            *sqlx.DB
}

var ConfigDefault = Config{
	ExcludedPaths: []string{"/users/", "/users/login"},
}

func createConfig(config ...Config) (Config, error) {
	if len(config) < 1 {
		return ConfigDefault, nil
	}

	cfg := config[0]

	if cfg.ExcludedPaths == nil {
		cfg.ExcludedPaths = ConfigDefault.ExcludedPaths
	}

	if cfg.DB == nil {
		return ConfigDefault, errors.New("middleware not initialized")
	}

	return cfg, nil
}

func New(config Config) fiber.Handler {
	cfg, err := createConfig(config)

	return func(c *fiber.Ctx) error {
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		for _, path := range cfg.ExcludedPaths {
			if c.Path() == path {
				println("skipping auth because of path")
				return c.Next()
			}
		}

		keks := c.Cookies("session")
		var session handlers.Session
		var user handlers.User

		tx := cfg.DB.MustBegin()
		err = tx.Get(&session, "select * from sessions where id=$1", keks)

		if err != nil {
			return c.Status(fiber.StatusUnauthorized).SendString(err.Error())
		}

		sessionExpirationTime := session.CreatedAt.Add(24 * time.Hour)

		if sessionExpirationTime.Before(time.Now()) {
			return c.Status(fiber.StatusUnauthorized).SendString("session expired")
		}

		err = tx.Get(&user, "select * from users where id=$s", session.UserID)
		tx.Commit()
		if err != nil {
			return c.Status(fiber.StatusNotFound).SendString(err.Error())
		}

		c.Locals("user", user)

		return c.Next()
	}
}
