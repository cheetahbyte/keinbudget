package handlers

import (
	"net/http"

	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AccountsHandler struct {
	DB *sqlx.DB
}

func (handler *AccountsHandler) HandleAddAccount(w http.ResponseWriter, r *http.Request) {
	user, _ := r.Context().Value(middleware.UserTypeContextKeyString).(types.User)

	var data types.AccountCreateDTO
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

	balance := data.Balance

	acc := types.Account{
		ID:      uuid.New(),
		UserID:  user.ID,
		Name:    data.Name,
		Balance: balance,
	}

	_, err = handler.DB.NamedExec("insert into accounts(id, user_id, name, balance) values(:id, :user_id, :name, :balance)", &acc)
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

	utils.WriteJSON(w, 201, acc)
}
