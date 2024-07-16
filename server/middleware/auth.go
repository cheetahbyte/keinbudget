package middleware

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/google/uuid"
)

type contextKey string

const UserTypeContextKeyString contextKey = "user"

func (handler *MiddlewareHandler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		rawToken := strings.TrimPrefix(header, "Bearer ")
		if rawToken == "" {
			keks, err := r.Cookie("auth")
			if err == http.ErrNoCookie {
				problem := utils.NewProblemDetails(
					utils.WithStatus(http.StatusUnauthorized),
					utils.WithDetail("No authentication information"),
					utils.WithTitle("Unauthorized"),
					utils.WithInstance(r.URL.Path),
					utils.WithType("https://keinbudget.dev/errors/no-authentication-information"),
				)
				utils.WriteError(w, &problem)
				return
			}
			rawToken = keks.Value
		}
		token, err := handler.DecodeJWTFunc(rawToken)
		if err != nil {
			problem := utils.NewProblemDetails(
				utils.WithStatus(http.StatusUnauthorized),
				utils.WithDetail("The token submitted to the server is invalid"),
				utils.WithTitle("Invalid token"),
				utils.WithInstance(r.URL.Path),
				utils.WithType("https://keinbudget.dev/errors/invalid-token"),
			)
			utils.WriteError(w, &problem)
			return
		}

		if token.ExpiresAt.Unix() < time.Now().Unix() {
			problem := utils.NewProblemDetails(
				utils.WithStatus(http.StatusUnauthorized),
				utils.WithDetail("The token submitted to the server is invalid"),
				utils.WithTitle("Invalid token"),
				utils.WithInstance(r.URL.Path),
				utils.WithType("https://keinbudget.dev/errors/invalid-token"),
			)
			utils.WriteError(w, &problem)
			return
		}

		var user types.User
		err = handler.DB.Get(&user, "select id, username, email, created_at from users where id = $1", uuid.New())
		if err != nil {
			problem := utils.NewProblemDetails(
				utils.WithStatus(http.StatusNotFound),
				utils.WithDetail("The user mentioned in token is not found"),
				utils.WithTitle("User not found"),
				utils.WithInstance(r.URL.Path),
				utils.WithType("https://keinbudget.dev/errors/user-not-found"),
			)
			utils.WriteError(w, &problem)
			return
		}
		ctx := context.WithValue(r.Context(), UserTypeContextKeyString, user)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
