package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cheetahybte/keinbudget/middleware"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/cheetahybte/keinbudget/types"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestJWTUserMiddleware(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()
	// Initialize echo instance
	e := echo.New()

	// mock repo
	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewUserRepository(sqlxDB)

	// Create a sample user
	id := uuid.New()
	user := &types.User{
		ID:        id,
		Email:     "test@example.com",
		Username:  "Test User",
		Password:  "hashedpassword",
		CreatedAt: time.Now(),
	}

	// JWT claims
	claims := &repositories.CustomJWTClaims{
		Email: "test@example.com",
	}

	// Create a valid JWT token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Prepare the middleware
	jwtMiddleware := middleware.JWTUserMiddleware(repo)

	t.Run("Success", func(t *testing.T) {
		// Mock repository method to return the user
		rows := sqlmock.NewRows([]string{"id", "email", "username", "password", "created_at"}).AddRow(user.ID, user.Email, user.Username, user.Password, user.CreatedAt)
		mock.ExpectQuery("select \\* from users where email = \\$1").WithArgs(user.Email).WillReturnRows(rows)
		// Create an HTTP request and recorder
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()

		// Create an echo context with the JWT token
		c := e.NewContext(req, rec)
		c.Set("user", token) // Simulating JWT being set in the context

		// Wrap a dummy handler with the middleware
		handler := jwtMiddleware(func(c echo.Context) error {
			cc := c.(*middleware.CustomContext)
			assert.Equal(t, user, cc.GetUser())
			return c.String(http.StatusOK, "OK")
		})

		// Execute the handler
		err := handler(c)

		// Assertions
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
