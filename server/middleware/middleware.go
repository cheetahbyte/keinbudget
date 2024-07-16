package middleware

import (
	"net/http"

	"github.com/cheetahybte/keinbudget-backend/pkg/auth"
	"github.com/jmoiron/sqlx"
)

type MiddlewareHandler struct {
	DB            *sqlx.DB
	DecodeJWTFunc func(string) (*auth.JWTClaims, error)
}

type Middleware func(http.Handler) http.Handler

func Chain(middlewares ...Middleware) Middleware {
	return func(final http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var current http.Handler = final
			for i := len(middlewares) - 1; i >= 0; i-- {
				current = middlewares[i](current)
			}
			current.ServeHTTP(w, r)
		})
	}
}
