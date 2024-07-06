package handlers

import (
	"fmt"
	"math/big"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TransactionsHandler struct {
	DB *sqlx.DB
}

type Transaction struct {
	ID        uuid.UUID `json:"id" db:"id"`
	From      uuid.UUID `json:"from" db:"from"`
	To        uuid.UUID `json:"to" db:"to"`
	Balance   float32   `json:"balance" db:"balance"`
	Message   string    `json:"message" db:"message"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type TransactionDTO struct {
	From    uuid.UUID `json:"from"`
	To      uuid.UUID `json:"to"`
	Message string    `json:"message"`
	Balance big.Rat   `json:"balance"`
}

func (handler *TransactionsHandler) NewTransaction(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(User)

	if !ok {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to retrieve user from session middleware")
	}

	var transactionData TransactionDTO
	if err := c.BodyParser(&transactionData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	balance, _ := transactionData.Balance.Float32()

	transaction := Transaction{
		ID:        uuid.New(),
		UserID:    user.ID,
		From:      transactionData.From,
		To:        transactionData.To,
		Message:   transactionData.Message,
		Balance:   balance,
		CreatedAt: time.Now(),
	}

	tx := handler.DB.MustBegin()
	// get both accounts
	var acc Account
	var extAcc ExternalAccount

	query := "select * from %s where user_id= $1 and id in ($2, $3);"

	err := tx.Get(&acc, fmt.Sprintf(query, "accounts"), user.ID, transaction.From, transaction.To)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusNotFound).SendString(err.Error())
	}

	err = tx.Get(&extAcc, fmt.Sprintf(query, "external_accounts"), user.ID, transaction.From, transaction.To)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusNotFound).SendString(err.Error())
	}

	if transaction.From == acc.ID {
		acc.Balance -= transaction.Balance
	} else {
		acc.Balance += transaction.Balance
	}

	_, err = tx.Exec("update accounts set balance = $1 where id = $2", acc.Balance, acc.ID)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	_, err = tx.NamedExec("insert into transactions(id, user_id, fr_acc, to_acc, message, balance) values(:id, :user_id, :from, :to, :message, :balance)", &transaction)

	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	if err = tx.Commit(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.JSON(transaction)
}

func (handler *TransactionsHandler) DeleteTransaction(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(User)

	if !ok {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to retrieve user from session middleware")
	}

	transactionID, err := uuid.Parse(c.Params("id", ""))
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString("no transaction id")
	}

	tx := handler.DB.MustBegin()

	_, err = tx.Exec("delete from transactions where user_id=$1 and id=$2", user.ID, transactionID)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	tx.Commit()

	return c.SendString("")

}
