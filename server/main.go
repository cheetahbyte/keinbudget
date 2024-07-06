package main

import (
	"fmt"
	"log"

	"github.com/cheetahybte/keinbudget-backend/config"
	"github.com/cheetahybte/keinbudget-backend/database"
	"github.com/cheetahybte/keinbudget-backend/handlers"
	"github.com/cheetahybte/keinbudget-backend/middleware/sessions"
	"github.com/gofiber/fiber/v2"
)

func main() {
	log.Default().Println("Starting application")
	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})

	config, err := config.GetConfig()
	if err != nil {
		log.Fatalf("Error loading config: %s", err.Error())
	}

	database.SetupDatabase(config)
	defer database.DB.Close()

	sessionMiddlewareConfig := sessions.Config{
		DB: database.DB,
	}

	app.Use(sessions.New(sessionMiddlewareConfig))

	userHandler := handlers.UserHandler{DB: database.DB}
	userGroup := app.Group("/users")
	{
		userGroup.Post("/", userHandler.NewUser)
		userGroup.Post("/login", userHandler.LoginUser)
	}

	accountsHandler := handlers.AccountsHandler{DB: database.DB}
	accountsGroup := app.Group("/accounts")
	{
		accountsGroup.Post("/", accountsHandler.NewAccount)
		accountsGroup.Delete("/:id", accountsHandler.DeleteAccount)
	}

	externalAccountsHandler := handlers.ExternalAccountsHandler{DB: database.DB}
	externalAccountsGroup := app.Group("/external-accounts")
	{
		externalAccountsGroup.Post("/", externalAccountsHandler.NewExternalAccount)
		externalAccountsGroup.Delete("/:id", externalAccountsHandler.DeleteExternalAccount)
	}

	transactionsHandler := handlers.TransactionsHandler{DB: database.DB}
	transactionsGroup := app.Group("/transactions")
	{
		transactionsGroup.Post("/", transactionsHandler.NewTransaction)
		transactionsGroup.Delete("/:id", transactionsHandler.DeleteTransaction)
	}

	categoryHandler := handlers.CategoriesHandler{DB: database.DB}
	categoryGroup := app.Group("/categories")
	{
		categoryGroup.Post("/", categoryHandler.NewCategory)
		categoryGroup.Delete("/:id", categoryHandler.DeleteCategory)
	}

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hi")
	})

	if err := app.Listen(fmt.Sprintf(":%v", config.Port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
