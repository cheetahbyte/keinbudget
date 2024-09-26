package repositories

import (
	"time"

	"github.com/cheetahybte/keinbudget/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AccountRepository struct {
	db *sqlx.DB
}

func NewAccountRepository(db *sqlx.DB) *AccountRepository {
	return &AccountRepository{
		db: db,
	}
}

func (r *AccountRepository) CreateAccount(user uuid.UUID, name string, balance float32) (*types.Account, error) {
	account := &types.Account{
		ID:        uuid.New(),
		Name:      name,
		Balance:   balance,
		CreatedAt: time.Now(),
		UserID:    user,
	}

	_, err := r.db.NamedExec("insert into accounts (id, user_id, name, balance, created_at) values(:id, :user_id, :name, :balance, :created_at)", account)

	if err != nil {
		return nil, err
	}

	return account, nil
}

func (r *AccountRepository) GetAccount(id uuid.UUID) (*types.Account, error) {
	var account types.Account

	err := r.db.Get(&account, "select * from accounts where id = ?", id)

	if err != nil {
		return nil, err
	}

	return &account, nil
}

func (r *AccountRepository) GetAccountsForUser(user uuid.UUID) ([]*types.Account, error) {
	var accounts []*types.Account
	err := r.db.Select(&accounts, "select * from accounts where user_id = ?", user)

	if err != nil {
		return nil, err
	}

	return accounts, nil
}

func (r *AccountRepository) DeleteAccount(user, id uuid.UUID) error {
	// TODO: maybe check if account exists. db.Exec will never throw error if no rows are effected.
	_, err := r.db.Exec("delete from accounts where id = ? and user_id = ?", id, user)
	if err != nil {
		return err
	}
	return nil
}
