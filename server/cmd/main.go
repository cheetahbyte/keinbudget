package main

import (
	"fmt"

	"github.com/cheetahybte/keinbudget/config"
	"github.com/cheetahybte/keinbudget/database"
	"github.com/cheetahybte/keinbudget/handlers"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	config, _ := config.GetConfig()
	database.SetupDatabase(config)

	// repositories
	userRepo := repositories.NewUserRepository(database.DB)
	// handlers
	userHandler := handlers.UserHandler{UserRepository: userRepo}
	// routes
	userGroup := e.Group("/users")
	{
		userGroup.POST("/", userHandler.HandleAddUser)
	}

	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%v", config.Addr, config.Port)))
}
