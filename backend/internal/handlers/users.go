package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/cheetahbyte/keinbudget/backend/internal/config"
	"github.com/cheetahbyte/keinbudget/backend/internal/database"
	"github.com/cheetahbyte/keinbudget/backend/internal/typings"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// TODO: error handling
func CreateUserHandler(config *config.Config, db *database.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		var data typings.CreateUserDTO

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if data.Email == "" || data.Password == "" {
			http.Error(w, "email and password fields required.", http.StatusUnprocessableEntity)
			return
		}

		passwordHash, err := bcrypt.GenerateFromPassword([]byte(data.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("error hasing password")
		}

		err = db.CreateUser(ctx, database.CreateUserParams{
			Email:        data.Email,
			PasswordHash: string(passwordHash),
		})
		if err != nil {
			log.Printf("fehler: %v", err)
		}

		user, err := db.GetUserByEmail(ctx, data.Email)
		if err != nil {
			log.Printf("Something went wrong: %v", err)
		}

		json.NewEncoder(w).Encode(&typings.UserSafe{ID: user.ID, Email: user.Email})
	}
}

func GetMeUserHandler(config *config.Config, db *database.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		userData := ctx.Value("user").(jwt.MapClaims)
		if userData == nil {
			http.Error(w, "user data not provided", http.StatusNotAcceptable)
		}
		user, err := db.GetUserByEmail(ctx, userData["user"].(string))
		if err != nil {
			http.Error(w, "user not found", 404)
			return
		}
		json.NewEncoder(w).Encode(&typings.UserSafe{ID: user.ID, Email: user.Email})
	}
}
