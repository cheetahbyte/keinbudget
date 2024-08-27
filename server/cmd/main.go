package main

import (
	"fmt"

	"github.com/cheetahybte/keinbudget/config"
	"github.com/cheetahybte/keinbudget/database"
	"github.com/cheetahybte/keinbudget/handlers"
	m "github.com/cheetahybte/keinbudget/middleware"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	config, _ := config.GetConfig()
	database.SetupDatabase(config)

	// repositories
	userRepo := repositories.NewUserRepository(database.DB)

	// middlewares
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())
	e.Use(middleware.Logger())
	e.Use(middleware.AddTrailingSlash())

	protectedGroup := e.Group("")
	protectedGroup.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey:  []byte("secret"),
		TokenLookup: "header:Authorization:Bearer ,cookie:getrich",
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(repositories.CustomJWTClaims)
		},
	}))
	protectedGroup.Use(m.JWTUserMiddleware(userRepo))

	protectedGroup.GET("test", func(c echo.Context) error {
		user := c.(*m.CustomContext).User
		return c.String(200, fmt.Sprintf("hello %s", user.Username))
	})
	// handlers
	userHandler := handlers.UserHandler{UserRepository: userRepo}
	// routes
	userGroup := e.Group("/users")
	userGroup.POST("/", userHandler.HandleAddUser)
	userGroup.POST("/login", userHandler.HandleLoginUser)

	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%v", config.Addr, config.Port)))
}
