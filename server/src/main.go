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

	app.POST("/", accountsHandler.Create)

	app.Run(":8080")
}
