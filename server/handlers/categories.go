package handlers

import (
	"net/http"

	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CategoriesHandler struct {
	DB *sqlx.DB
}

func (handler *CategoriesHandler) HandleAddCategory(w http.ResponseWriter, r *http.Request) {
	user, _ := r.Context().Value(middleware.UserTypeContextKeyString).(types.User)

	var data types.CategoryDTO
	err := utils.ParseJSON(r, &data)
	if err != nil {
		problem := utils.NewProblemDetails(
			utils.WithStatus(http.StatusUnprocessableEntity),
			utils.WithDetail(err.Error()),
			utils.WithTitle("Parsing error"),
			utils.WithInstance(r.URL.Path),
			utils.WithType("https://keinbudget.dev/errors/parsing-error"),
		)
		utils.WriteError(w, &problem)
		return
	}

	category := types.Category{
		ID:     uuid.New(),
		UserID: user.ID,
		Name:   data.Name,
	}

	if data.Parent != nil {
		var parent types.Category
		err = handler.DB.Get(&parent, "select * from categories where id = $1 and user_id = $2;", data.Parent)
		if err != nil {
			problem := utils.NewProblemDetails(
				utils.WithStatus(http.StatusNotFound),
				utils.WithDetail(err.Error()),
				utils.WithTitle("Parent category not found"),
				utils.WithInstance(r.URL.Path),
				utils.WithType("https://keinbudget.dev/errors/parent-category-not-found"),
			)
			utils.WriteError(w, &problem)
			return
		}
		category.Parent = parent.ID
	}

	_, err = handler.DB.NamedExec("insert into categories(id, user_id, parent_id, name) values(:id, :user_id, :parent_id, :name)", &category)
	if err != nil {
		problem := utils.NewProblemDetails(
			utils.WithStatus(http.StatusUnprocessableEntity),
			utils.WithDetail(err.Error()),
			utils.WithTitle("SQL Error"),
			utils.WithInstance(r.URL.Path),
			utils.WithType("https://keinbudget.dev/errors/sql-error"),
		)
		utils.WriteError(w, &problem)
		return
	}
	utils.WriteJSON(w, 201, category)
}
