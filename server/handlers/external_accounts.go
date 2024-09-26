package handlers

import (
	"net/http"

	"github.com/cheetahybte/keinbudget/middleware"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/cheetahybte/keinbudget/types"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type ExternalAccountHandler struct {
	UserRepository           *repositories.UserRepository
	ExternalAccontRepository *repositories.ExternalAccountRepository
}

func (h *ExternalAccountHandler) HandleAddExternalAccount(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User

	var data types.ExternalAccountCreateDTO

	err := ctx.Bind(data)
	if err != nil {
		return ctx.String(http.StatusUnprocessableEntity, "bad entity")
	}

	exAcc, err := h.ExternalAccontRepository.CreateExternalAccount(user.ID, data.Name)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusCreated, exAcc)
}

func (h *ExternalAccountHandler) HandleGetExternalAccounts(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User
	exAccs, err := h.ExternalAccontRepository.GetExternalAccountsForUser(user.ID)

	if err != nil {
		return err
	}

	if len(exAccs) == 0 {
		exAccs = []*types.ExternalAccount{}
	}

	return ctx.JSON(http.StatusOK, exAccs)
}

func (h *ExternalAccountHandler) HandleGetAccount(ctx echo.Context) error {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return err
	}

	acc, err := h.ExternalAccontRepository.GetExternalAccount(id)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, acc)
}

func (h *ExternalAccountHandler) HandleDeleteExternalAccount(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return err
	}

	err = h.ExternalAccontRepository.DeleteExternalAccount(user.ID, id)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, map[string]int{"ok": 1})
}
