package tests

import (
	"keinbudget/server/src/database"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	app := gin.Default()
	database.SetupDatabase(":memory:")
	return app
}
