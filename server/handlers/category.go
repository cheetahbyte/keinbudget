package handlers

import (
	"net/http"

	"github.com/cheetahybte/keinbudget/middleware"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/cheetahybte/keinbudget/types"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type CategoriesHandler struct {
	UserRepository     *repositories.UserRepository
	CategoryRepository *repositories.CategoryRepository
}

func (h *CategoriesHandler) HandleAddCategory(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User

	var data types.CategoryDTO

	err := ctx.Bind(&data)
	if err != nil {
		return ctx.String(http.StatusUnprocessableEntity, "cannot process entity")
	}
	var cat *types.Category

	if data.Parent != nil {
		cat, err = h.CategoryRepository.CreateCategory(user.ID, data.Name)
	} else {
		cat, err = h.CategoryRepository.CreateCategoryWithParent(user.ID, *data.Parent, data.Name)
	}
	if err != nil {
		return ctx.String(http.StatusInternalServerError, err.Error())
	}
	return ctx.JSON(http.StatusCreated, cat)
}

func (h *CategoriesHandler) HandleGetCategories(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User

	accs, err := h.CategoryRepository.GetCategories(user.ID)

	if err != nil {
		return err
	}

	if len(accs) == 0 {
		accs = []*types.Category{}
	}

	return ctx.JSON(http.StatusOK, accs)
}

func (h *CategoriesHandler) HandleGetCategory(ctx echo.Context) error {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return err
	}
	cat, err := h.CategoryRepository.GetCategory(id)
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, cat)
}

func (h *CategoriesHandler) HandleDeleteCategory(ctx echo.Context) error {
	user := ctx.(*middleware.CustomContext).User
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return err
	}

	err = h.CategoryRepository.DeleteCategory(user.ID, id)

	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, map[string]int{"ok": 1})
}
