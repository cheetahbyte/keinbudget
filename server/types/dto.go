package types

import (
	"math/big"

	"github.com/google/uuid"
)

type UserDataDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Username string `json:"username"`
	Password string `json:"password" validate:"required"`
}

type UserLoginDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type TransactionCreateDTO struct {
	From    uuid.UUID `json:"from" validate:"required,uuid4"`
	To      uuid.UUID `json:"to" validate:"required,uuid4"`
	Message string    `json:"message" validate:"required,ascii"`
	Balance big.Rat   `json:"balance" validate:"required,number"`
}

type ExternalAccountCreateDTO struct {
	Name string `json:"accountName" validate:"required"`
}

type AccountCreateDTO struct {
	Name    string  `json:"accountName" validate:"required"`
	Balance float32 `json:"startBalance" validate:"number"`
}

type CategoryDTO struct {
	Name   string     `json:"name" validate:"required"`
	Parent *uuid.UUID `json:"parent_id" validate:"uuid"`
}
