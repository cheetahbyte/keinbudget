package middleware_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/auth"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockAuth for mocking the auth.DecodeJWT function
type MockAuth struct {
	mock.Mock
}

func (m *MockAuth) DecodeJWT(token string) (*auth.JWTClaims, error) {
	args := m.Called(token)
	t, _ := args.Get(0).(*auth.JWTClaims)
	l, e := t, args.Error(1)
	return l, e
}

func TestAuthMiddleware(t *testing.T) {
	mockAuth := new(MockAuth)
	handler := &middleware.MiddlewareHandler{DB: nil, DecodeJWTFunc: mockAuth.DecodeJWT}

	t.Run("No Authorization header or cookie", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/test", nil)
		rr := httptest.NewRecorder()

		handler.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})).ServeHTTP(rr, req)

		assert.Equal(t, http.StatusUnauthorized, rr.Code)
		assert.Contains(t, rr.Body.String(), "No authentication information")
	})

	t.Run("Invalid JWT token", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/test", nil)
		req.Header.Set("Authorization", "Bearer invalidToken")

		rr := httptest.NewRecorder()
		mockAuth.On("DecodeJWT", "invalidToken").Return(nil, errors.New("invalid token"))

		handler.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})).ServeHTTP(rr, req)

		assert.Equal(t, http.StatusUnauthorized, rr.Code)
		assert.Contains(t, rr.Body.String(), "The token submitted to the server is invalid")
	})

	t.Run("Expired JWT token", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/test", nil)
		req.Header.Set("Authorization", "Bearer expiredToken")
		rr := httptest.NewRecorder()

		expiredToken := &auth.JWTClaims{RegisteredClaims: jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Hour))}}
		mockAuth.On("DecodeJWT", "expiredToken").Return(expiredToken, nil)

		handler.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})).ServeHTTP(rr, req)

		assert.Equal(t, http.StatusUnauthorized, rr.Code)
		assert.Contains(t, rr.Body.String(), "The token submitted to the server is invalid")
	})
}
