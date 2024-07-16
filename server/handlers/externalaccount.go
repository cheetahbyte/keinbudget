package handlers

import (
	"net/http"
	"time"

	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ExternalAccountsHandler struct {
	DB *sqlx.DB
}

func (handler *ExternalAccountsHandler) HandleAddExternalAccount(w http.ResponseWriter, r *http.Request) {
	user, _ := r.Context().Value(middleware.UserTypeContextKeyString).(types.User)

	var data types.ExternalAccountCreateDTO
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

	externalAccount := types.ExternalAccount{
		ID:        uuid.New(),
		UserID:    user.ID,
		Name:      data.Name,
		CreatedAt: time.Now(),
	}

	_, err = handler.DB.NamedExec("insert into external_accounts(id, user_id, name) values(:id, :user_id, :name)", &externalAccount)
	if err != nil {
		problem := utils.NewProblemDetails(
			utils.WithStatus(http.StatusInternalServerError),
			utils.WithDetail("missing information"),
			utils.WithTitle("needs work"),
			utils.WithInstance(r.URL.Path),
			utils.WithType("https://keinbudget.dev/errors/unknown"),
		)
		utils.WriteError(w, &problem)
		return
	}

	utils.WriteJSON(w, 201, externalAccount)
}
