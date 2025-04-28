package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/cheetahbyte/keinbudget/backend/internal/config"
	"github.com/cheetahbyte/keinbudget/backend/internal/database"
	"github.com/cheetahbyte/keinbudget/backend/internal/typings"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func floatToNumeric(f float64) pgtype.Numeric {
	str := strconv.FormatFloat(f, 'f', -1, 64) // float64 zu String
	var num pgtype.Numeric
	err := num.Scan(str) // Scan erwartet ein string/[]byte/numeric
	if err != nil {
		return pgtype.Numeric{}
	}
	return num
}

func CreateAccountHandler(config *config.Config, db *database.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		var data typings.CreateAccountDTO
		userData := ctx.Value("user").(jwt.MapClaims)

		if userData == nil {
			http.Error(w, "user data not provided", http.StatusNotAcceptable)
			return
		}

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusUnprocessableEntity)
			return
		}

		if data.Name == "" {
			http.Error(w, "account name is required", http.StatusUnprocessableEntity)
		}

		email := userData["user"].(string)

		user, err := db.GetUserByEmail(ctx, email)

		if err != nil {
			http.Error(w, "user not foun", http.StatusNotAcceptable)
		}

		acc, err := db.CreateAccount(ctx, database.CreateAccountParams{
			Name:            data.Name,
			UserID:          user.ID,
			StartingBalance: floatToNumeric(float64(data.StartBalance)),
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("could not create account: %s", err.Error()), 404)
			return
		}
		json.NewEncoder(w).Encode(acc)
	}
}

func GetAccountsHandler(config *config.Config, db *database.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		userData := ctx.Value("user").(jwt.MapClaims)
		email, ok := userData["user"].(string)

		if !ok {
			http.Error(w, "user not found", http.StatusNotFound)
			return
		}

		user, err := db.GetUserByEmail(ctx, email)

		if err != nil {
			http.Error(w, "user not found", http.StatusNotFound)
			return
		}

		res, err := db.GetAccounts(ctx, user.ID)

		if err != nil {
			http.Error(w, "error occured", http.StatusInternalServerError)
			return
		}

		if len(res) == 0 {
			json.NewEncoder(w).Encode([]database.Account{})
			return
		}

		json.NewEncoder(w).Encode(res)
	}
}
