package repositories_test

import (
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
)

func TestCreateExternalAccount(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewExternalAccountRepository(sqlxDB)

	userID := uuid.New()
	accountName := "Test Account"

	mock.ExpectExec("insert into external_accounts").
		WithArgs(sqlmock.AnyArg(), userID, accountName, sqlmock.AnyArg()).
		WillReturnResult(sqlmock.NewResult(1, 1))

	account, err := repo.CreateExternalAccount(userID, accountName)

	assert.NoError(t, err)
	assert.NotNil(t, account)
	assert.Equal(t, accountName, account.Name)
	assert.Equal(t, userID, account.UserID)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetExternalAccountAccount(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewExternalAccountRepository(sqlxDB)

	accountID := uuid.New()
	userID := uuid.New()
	accountName := "Test Account"
	createdAt := time.Now()

	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "created_at"}).
		AddRow(accountID, userID, accountName, createdAt)

	mock.ExpectQuery("select \\* from external_accounts where id = ?").
		WithArgs(accountID).
		WillReturnRows(rows)

	account, err := repo.GetExternalAccount(accountID)

	assert.NoError(t, err)
	assert.NotNil(t, account)
	assert.Equal(t, accountID, account.ID)
	assert.Equal(t, accountName, account.Name)
	assert.Equal(t, createdAt, account.CreatedAt)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetExternalAccountsAccountsForUser(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewExternalAccountRepository(sqlxDB)

	userID := uuid.New()

	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "created_at"}).
		AddRow(uuid.New(), userID, "Account 1", time.Now()).
		AddRow(uuid.New(), userID, "Account 2", time.Now())

	mock.ExpectQuery("select \\* from external_accounts where user_id = ?").
		WithArgs(userID).
		WillReturnRows(rows)

	external_accounts, err := repo.GetExternalAccountsForUser(userID)

	assert.NoError(t, err)
	assert.Len(t, external_accounts, 2)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestDeleteExternalAccount(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewExternalAccountRepository(sqlxDB)

	userID := uuid.New()
	accountID := uuid.New()

	mock.ExpectExec(regexp.QuoteMeta("delete from external_accounts where id = ? and user_id = ?")).
		WithArgs(accountID, userID).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.DeleteExternalAccount(userID, accountID)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}
