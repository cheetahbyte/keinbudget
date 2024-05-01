package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Account struct {
	ID              uuid.UUID `json:"id" gorm:"primaryKey"`
	Name            string    `json:"name"`
	Iban            string    `json:"iban"`
	Balance         float64   `json:"balance"`
	StartingBalance float64   `json:"starting_balance"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	DeletedAt       time.Time `gorm:"index" json:"deleted_at"`
}

type ExternalAccount struct {
	ID        uuid.UUID `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt time.Time `gorm:"index" json:"deleted_at"`
}

func (exacc *ExternalAccount) BeforeCreate(tx *gorm.DB) (err error) {
	exacc.ID = uuid.New()
	return
}

func (acc *Account) BeforeCreate(tx *gorm.DB) (err error) {
	acc.ID = uuid.New()
	return
}
