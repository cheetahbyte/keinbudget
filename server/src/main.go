package main

import (
	"keinbudget/server/src/database"
	"keinbudget/server/src/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	app := gin.Default()

	database.SetupDatabase("gorm.db")

	accountsHandler := handlers.AccountsHandler{DB: database.DB}

	accounts := app.Group("/accounts")
	{
		accounts.POST("/", accountsHandler.Create)
		accounts.GET("/", accountsHandler.Get)
		accounts.GET("/:id", accountsHandler.GetById)
		accounts.DELETE("/:id", accountsHandler.Delete)
	}

	extneralAccountsHandler := handlers.ExternalAccountsHandler{DB: database.DB}

	externalAccounts := app.Group("/external-accounts")
	{
		externalAccounts.POST("/", extneralAccountsHandler.Create)
		externalAccounts.GET("/", extneralAccountsHandler.Get)
		externalAccounts.GET("/:id", extneralAccountsHandler.GetById)
		externalAccounts.DELETE("/:id", extneralAccountsHandler.Delete)
	}

	app.Run(":8080")
}
