package types

import (
	"time"

	"github.com/google/uuid"
)

type (
	User struct {
		ID        uuid.UUID `json:"id" db:"id"`
		Email     string    `json:"email" db:"email"`
		Username  string    `json:"username" db:"username"`
		Password  string    `json:"-" db:"password"`
		CreatedAt time.Time `json:"createdAt" db:"created_at"`
	}
)

type (
	ProblemDetails struct {
		Type     string `json:"type"`
		Title    string `json:"title"`
		Status   int    `json:"status"`
		Detail   string `json:"detail"`
		Instance string `json:"instance,omitempty"`
	}
	ProblemDetailOption func(*ProblemDetails)
)

type Map map[string]interface{}

type (
	Transaction struct {
		ID        uuid.UUID `json:"id" db:"id"`
		From      uuid.UUID `json:"from" db:"from"`
		To        uuid.UUID `json:"to" db:"to"`
		Balance   float32   `json:"balance" db:"balance"`
		Message   string    `json:"message" db:"message"`
		UserID    uuid.UUID `json:"userId" db:"user_id"`
		CreatedAt time.Time `json:"createdAt" db:"created_at"`
	}
	ExternalAccount struct {
		ID        uuid.UUID `json:"id" db:"id"`
		UserID    uuid.UUID `json:"userId" db:"user_id"`
		Name      string    `json:"accountName" db:"name"`
		CreatedAt time.Time `json:"createdAt" db:"created_at"`
	}
	Account struct {
		ID        uuid.UUID `json:"id" db:"id"`
		UserID    uuid.UUID `json:"userId" db:"user_id"`
		Name      string    `json:"accountName" db:"name"`
		Balance   float32   `json:"balance" db:"balance"`
		CreatedAt time.Time `json:"createdAt" db:"created_at"`
	}
	Category struct {
		ID     uuid.UUID `json:"id" db:"id"`
		UserID uuid.UUID `json:"user" db:"user_id"`
		Parent uuid.UUID `json:"parent" db:"parent_id"`
		Name   string    `json:"name" db:"name"`
	}
)
