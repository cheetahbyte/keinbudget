package repositories

import (
	"time"

	"github.com/cheetahybte/keinbudget/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ExternalAccountRepository struct {
	db *sqlx.DB
}

func NewExternalAccountRepository(db *sqlx.DB) *ExternalAccountRepository {
	return &ExternalAccountRepository{
		db: db,
	}
}

func (r *ExternalAccountRepository) CreateExternalAccount(user uuid.UUID, name string) (*types.ExternalAccount, error) {
	externalAccount := &types.ExternalAccount{
		ID:        uuid.New(),
		Name:      name,
		UserID:    user,
		CreatedAt: time.Now(),
	}

	_, err := r.db.NamedExec("insert into external_accounts(id, user_id, name, creared_at) values(:id, :user_id, :name, :created_at)", externalAccount)

	if err != nil {
		return nil, err
	}

	return externalAccount, nil
}

func (r *ExternalAccountRepository) GetExternalAccount(id uuid.UUID) (*types.ExternalAccount, error) {
	var externalAccount types.ExternalAccount
	err := r.db.Get(&externalAccount, "select * from external_accounts where id = ?", id)

	if err != nil {
		return nil, err
	}

	return &externalAccount, err

}

func (r *ExternalAccountRepository) GetExternalAccountsForUser(user uuid.UUID) ([]*types.ExternalAccount, error) {
	var accounts []*types.ExternalAccount
	err := r.db.Select(&accounts, "select * from external_accounts where user_id = ?", user)
	if err != nil {
		return nil, err
	}

	return accounts, nil
}

func (r *ExternalAccountRepository) DeleteExternalAccount(user, id uuid.UUID) error {
	// TODO: maybe check if account exists. db.Exec will never throw error if no rows are effected.
	_, err := r.db.Exec("delete from external_accounts where id = ? and user_id = ?", id, user)
	if err != nil {
		return err
	}
	return nil
}
