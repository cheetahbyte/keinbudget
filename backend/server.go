package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type User struct {
	ID       uint16 `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserSafe struct {
	ID    uint16 `json:"id"`
	Email string `json:"email"`
}

var users []User

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("GET Request Received"))
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var data UserDTO
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	for _, user := range users {
		if user.Email == data.Email && user.Password == data.Password {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(&UserSafe{ID: user.ID, Email: user.Email})
			return
		}
	}
	fmt.Println(data)
	w.WriteHeader(http.StatusUnauthorized)
	w.Write([]byte("Received"))
}

func main() {
	users = append(users, User{ID: 1, Email: "test@test.de", Password: "password"})
	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler).Methods("GET")
	r.HandleFunc("/login", LoginHandler).Methods("POST")
	log.Fatal(http.ListenAndServe(":8080", r))
}
