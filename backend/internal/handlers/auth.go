package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheetahbyte/keinbudget/backend/pkg/auth"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var data UserDTO
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if data.Email == "" || data.Password == "" {
		http.Error(w, "email and password fields required.", http.StatusUnprocessableEntity)
		return
	}

	var user *User
	for _, iuser := range users {
		if iuser.Email == data.Email && iuser.Password == data.Password {
			user = &iuser
			break
		}
	}

	if user == nil {
		http.Error(w, "invalid email or password", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenerateJWT(user.Email, sampleSecretKey)
	if err != nil {
		fmt.Println(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
