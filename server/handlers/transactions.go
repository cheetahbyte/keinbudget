package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TransactionsHandler struct {
	DB *sqlx.DB
}

func (handler *TransactionsHandler) HandleAddTransaction(w http.ResponseWriter, r *http.Request) {
	user, _ := r.Context().Value(middleware.UserTypeContextKeyString).(types.User)

	var transactionData types.TransactionCreateDTO
	err := utils.ParseJSON(r, &transactionData)
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

	balance, _ := transactionData.Balance.Float32()
	transaction := types.Transaction{
		ID:        uuid.New(),
		From:      transactionData.From,
		To:        transactionData.To,
		Balance:   balance,
		Message:   transactionData.Message,
		UserID:    user.ID,
		CreatedAt: time.Now(),
	}
	tx := handler.DB.MustBegin()
	// get both accounts
	var acc types.Account
	var extAcc types.ExternalAccount

	query := "select * from %s where user_id= $1 and id in ($2, $3);"

	err = tx.Get(&acc, fmt.Sprintf(query, "accounts"), user.ID, transaction.From, transaction.To)
	if err != nil {
		tx.Rollback()
		return
	}

	err = tx.Get(&extAcc, fmt.Sprintf(query, "external_accounts"), user.ID, transaction.From, transaction.To)
	if err != nil {
		tx.Rollback()
		return
	}

	if transaction.From == acc.ID {
		acc.Balance -= transaction.Balance
	} else {
		acc.Balance += transaction.Balance
	}

	_, err = tx.Exec("update accounts set balance = $1 where id = $2", acc.Balance, acc.ID)
	if err != nil {
		tx.Rollback()
		return
	}

	_, err = tx.NamedExec("insert into transactions(id, user_id, fr_acc, to_acc, message, balance) values(:id, :user_id, :from, :to, :message, :balance)", &transaction)

	if err != nil {
		tx.Rollback()
		return
	}

	if err = tx.Commit(); err != nil {
		return
	}

	utils.WriteJSON(w, 201, transaction)

}
