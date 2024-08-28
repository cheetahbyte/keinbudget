package handlers

import (
	"net/http"
	"time"

	m "github.com/cheetahybte/keinbudget/middleware"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/cheetahybte/keinbudget/types"
	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	UserRepository *repositories.UserRepository
}

func (handler *UserHandler) HandleAddUser(ctx echo.Context) error {
	var data types.UserDataDTO

	err := ctx.Bind(&data)
	if err != nil {
		return ctx.String(http.StatusBadRequest, "bad request")
	}

	user, err := handler.UserRepository.CreateUser(data.Email, data.Password, data.Username)

	if err != nil {
		return err
	}

	return ctx.JSON(200, user)
}

func (handler *UserHandler) HandleLoginUser(ctx echo.Context) error {
	var data types.UserLoginDTO

	err := ctx.Bind(&data)
	if err != nil {
		return ctx.String(http.StatusUnprocessableEntity, "bad request")
	}

	token, err := handler.UserRepository.Login(data.Email, data.Password)

	if err != nil {
		return err
	}

	cookie := new(http.Cookie)
	cookie.Domain = "localhost"
	cookie.Path = "/"
	cookie.Expires = time.Now().Add(time.Hour * 72)
	cookie.HttpOnly = true
	cookie.Value = token
	cookie.Name = "getrich"

	ctx.SetCookie(cookie)
	ctx.Response().Header().Add("X-JWT", token)

	return ctx.JSON(200, map[string]int{"ok": 1})
}

func (handler *UserHandler) HandleGetMe(ctx echo.Context) error {
	user := ctx.(*m.CustomContext).User
	return ctx.JSON(http.StatusOK, user)
}
