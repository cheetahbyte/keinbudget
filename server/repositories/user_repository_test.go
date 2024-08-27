package repositories_test

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cheetahybte/keinbudget/pkg/auth"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
)

func TestCreateUser(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewUserRepository(sqlxDB)

	mockHash := "$2a$10$mockedpasswordhash"
	repo.HashPasswordFunction = func(password string) (string, error) {
		return mockHash, nil
	}

	mock.ExpectExec("insert into users").
		WithArgs(sqlmock.AnyArg(), "test@example.com", "Test User", mockHash).
		WillReturnResult(sqlmock.NewResult(1, 1))

	user, err := repo.CreateUser("test@example.com", "password123", "Test User")

	assert.NoError(t, err)
	assert.Equal(t, "test@example.com", user.Email)
	assert.Equal(t, "Test User", user.Username)
	assert.NotNil(t, user.ID)
	assert.WithinDuration(t, time.Now(), user.CreatedAt, time.Second)
}

func TestGetUserById(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewUserRepository(sqlxDB)

	userID := uuid.New()
	mock.ExpectQuery("select \\* from users where id = \\$1").
		WithArgs(userID).
		WillReturnRows(sqlmock.NewRows([]string{"id", "email", "username", "password", "created_at"}).
			AddRow(userID, "test@example.com", "Test User", "hashedpassword", time.Now()))

	user, err := repo.GetUserById(userID)

	assert.NoError(t, err)
	assert.Equal(t, userID, user.ID)
	assert.Equal(t, "test@example.com", user.Email)
}

func TestGetUserByEmail(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewUserRepository(sqlxDB)

	mock.ExpectQuery("select \\* from users where email = \\$1").
		WithArgs("test@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"id", "email", "username", "password", "created_at"}).
			AddRow(uuid.New(), "test@example.com", "Test User", "hashedpassword", time.Now()))

	user, err := repo.GetUserByEmail("test@example.com")

	assert.NoError(t, err)
	assert.Equal(t, "test@example.com", user.Email)
}

func TestLogin(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewUserRepository(sqlxDB)

	passwordHash, _ := auth.HashPassword("password123")
	mock.ExpectQuery("select \\* from users where email = \\$1").
		WithArgs("test@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"id", "email", "username", "password", "created_at"}).
			AddRow(uuid.New(), "test@example.com", "Test User", passwordHash, time.Now()))

	token, err := repo.Login("test@example.com", "password123")

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestDeleteUser(t *testing.T) {
	db, _, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewUserRepository(sqlxDB)

	// Since DeleteUser is not yet implemented, we just check that it returns true and nil error
	result, err := repo.DeleteUser(uuid.New())

	assert.NoError(t, err)
	assert.True(t, result)
}
