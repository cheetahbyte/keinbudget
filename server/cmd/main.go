package main

import (
	"fmt"
	"slices"

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
	accountsRepo := repositories.NewAccountRepository(database.DB)

	// middlewares
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())
	e.Use(middleware.Logger())
	e.Use(middleware.AddTrailingSlash())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"localhost:5173"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"*"},
	}))

	protectedGroup := e.Group("")
	protectedGroup.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey:  []byte("secret"),
		TokenLookup: "header:Authorization:Bearer ,cookie:getrich",
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(repositories.CustomJWTClaims)
		},
		Skipper: func(c echo.Context) bool {
			return slices.Contains(config.UnprotectedRoutes, c.Request().URL.String())
		},
	}))
	protectedGroup.Use(m.JWTUserMiddleware(userRepo))

	protectedGroup.GET("test", func(c echo.Context) error {
		user := c.(*m.CustomContext).User
		return c.String(200, fmt.Sprintf("hello %s", user.Username))
	})

	// user
	userHandler := handlers.UserHandler{UserRepository: userRepo}
	userGroup := e.Group("/users")
	protectedUserGroup := protectedGroup.Group("/users")
	userGroup.POST("/", userHandler.HandleAddUser)
	userGroup.POST("/login", userHandler.HandleLoginUser)
	protectedUserGroup.GET("/", userHandler.HandleGetMe)

	// accounts
	accountsHandler := handlers.AccountsHandler{UserRepository: userRepo, AccountRepository: accountsRepo}
	accountsGroup := protectedGroup.Group("/accounts")
	accountsGroup.POST("/", accountsHandler.HandleAddAccount)
	accountsGroup.GET("/", accountsHandler.HandleGetAccounts)
	accountsGroup.GET("/:id", accountsHandler.HandleGetAccount)
	accountsGroup.DELETE("/:id", accountsHandler.HandleDeleteAccount)

	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%v", config.Addr, config.Port)))
}
