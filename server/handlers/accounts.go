package handlers

import (
	"net/http"

	"github.com/cheetahybte/keinbudget/middleware"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/cheetahybte/keinbudget/types"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type AccountsHandler struct {
	UserRepository    *repositories.UserRepository
	AccountRepository *repositories.AccountRepository
}

func (h *AccountsHandler) HandleAddAccount(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User

	var data types.AccountCreateDTO

	err := ctx.Bind(&data)
	if err != nil {
		return ctx.String(http.StatusBadRequest, "bad request")
	}

	acc, err := h.AccountRepository.CreateAccount(user.ID, data.Name, data.Balance)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusCreated, acc)
}

func (h *AccountsHandler) HandleGetAccounts(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User

	accs, err := h.AccountRepository.GetAccountsForUser(user.ID)

	if err != nil {
		return err
	}

	if len(accs) == 0 {
		accs = []*types.Account{}
	}

	return ctx.JSON(http.StatusOK, accs)
}

func (h *AccountsHandler) HandleGetAccount(ctx echo.Context) error {
	// user := ctx.(*middleware.CustomContext).User

	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return err
	}
	acc, err := h.AccountRepository.GetAccount(id)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, acc)
}

func (h *AccountsHandler) HandleDeleteAccount(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return err
	}

	err = h.AccountRepository.DeleteAccount(user.ID, id)

	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, map[string]int{"ok": 1})
}
