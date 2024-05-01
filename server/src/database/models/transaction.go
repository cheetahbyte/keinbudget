package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	ID          uuid.UUID `json:"id" gorm:"primaryKey"`
	Date        time.Time `json:"time"`
	Amount      float64   `json:"amount"`
	Ext         uuid.UUID `json:"external_account"`
	Currency    string    `json:"currency"`
	Acc         uuid.UUID `json:"account"`
	Description string    `json:"description"`
}

func (user *Transaction) BeforeCreate(tx *gorm.DB) (err error) {
	user.ID = uuid.New()
	return
}
