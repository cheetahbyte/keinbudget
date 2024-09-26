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

func TestCreateAccount(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewAccountRepository(sqlxDB)

	userID := uuid.New()
	accountName := "Test Account"
	balance := float32(100.0)

	mock.ExpectExec("insert into accounts").
		WithArgs(sqlmock.AnyArg(), userID, accountName, balance, sqlmock.AnyArg()).
		WillReturnResult(sqlmock.NewResult(1, 1))

	account, err := repo.CreateAccount(userID, accountName, balance)

	assert.NoError(t, err)
	assert.NotNil(t, account)
	assert.Equal(t, accountName, account.Name)
	assert.Equal(t, balance, account.Balance)
	assert.Equal(t, userID, account.UserID)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetAccount(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewAccountRepository(sqlxDB)

	accountID := uuid.New()
	userID := uuid.New()
	accountName := "Test Account"
	balance := float32(100.0)
	createdAt := time.Now()

	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "balance", "created_at"}).
		AddRow(accountID, userID, accountName, balance, createdAt)

	mock.ExpectQuery("select \\* from accounts where id = ?").
		WithArgs(accountID).
		WillReturnRows(rows)

	account, err := repo.GetAccount(accountID)

	assert.NoError(t, err)
	assert.NotNil(t, account)
	assert.Equal(t, accountID, account.ID)
	assert.Equal(t, accountName, account.Name)
	assert.Equal(t, balance, account.Balance)
	assert.Equal(t, createdAt, account.CreatedAt)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetAccountsForUser(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewAccountRepository(sqlxDB)

	userID := uuid.New()

	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "balance", "created_at"}).
		AddRow(uuid.New(), userID, "Account 1", float32(100.0), time.Now()).
		AddRow(uuid.New(), userID, "Account 2", float32(200.0), time.Now())

	mock.ExpectQuery("select \\* from accounts where user_id = ?").
		WithArgs(userID).
		WillReturnRows(rows)

	accounts, err := repo.GetAccountsForUser(userID)

	assert.NoError(t, err)
	assert.Len(t, accounts, 2)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestDeleteAccount(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewAccountRepository(sqlxDB)

	userID := uuid.New()
	accountID := uuid.New()

	mock.ExpectExec(regexp.QuoteMeta("delete from accounts where id = ? and user_id = ?")).
		WithArgs(accountID, userID).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.DeleteAccount(userID, accountID)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}
