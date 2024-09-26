package middleware

import (
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/cheetahybte/keinbudget/types"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type CustomContext struct {
	echo.Context
	User *types.User
}

func (c *CustomContext) GetUser() *types.User {
	return c.User
}

func JWTUserMiddleware(userRepo *repositories.UserRepository) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			rawUser := c.Get("user").(*jwt.Token)
			claims := rawUser.Claims.(*repositories.CustomJWTClaims)
			user, err := userRepo.GetUserByEmail(claims.Email)
			if err != nil {
				return err
			}

			cc := &CustomContext{c, user}
			return next(cc)
		}
	}
}
