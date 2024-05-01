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
	}

	app.Run(":8080")
}
