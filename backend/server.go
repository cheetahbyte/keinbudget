package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/cheetahbyte/keinbudget/backend/internal/config"
	"github.com/cheetahbyte/keinbudget/backend/internal/database"
	"github.com/cheetahbyte/keinbudget/backend/internal/handlers"
	"github.com/cheetahbyte/keinbudget/backend/internal/middleware"
	"github.com/cheetahbyte/keinbudget/backend/pkg/auth"
	h "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var sampleSecretKey = []byte("secret")

type User struct {
	ID        uint16 `json:"id"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type UserDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserSafe struct {
	ID        uint16 `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type Payment struct {
	ID          string    `json:"id"`
	Description string    `json:"description"`
	Amount      float32   `json:"amount"`
	Date        time.Time `json:"time"`
}

type Account struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	StartingBudget float32   `json:"startingBudget"`
	Payments       []Payment `json:"payments"`
}

var accounts = []Account{
	{
		ID:             "abc",
		Name:           "Testgiro",
		StartingBudget: 10,
		Payments: []Payment{
			{
				ID:          "abc",
				Description: "Einkauf Rewe Darmstadt",
				Amount:      5.9,
				Date:        time.Now(),
			},
		},
	},
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer") {
			http.Error(w, "missing or invalid Authorization header", http.StatusUnauthorized)
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := auth.ValidateJWT(token, sampleSecretKey)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), "user", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("GET Request Received"))
}

func ValidateTokenHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer") {
		http.Error(w, "missing or invalid Authorization header", http.StatusUnauthorized)
		return
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	_, err := auth.ValidateJWT(tokenString, sampleSecretKey)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(map[string]any{"valid": true})
}

func main() {
	r := mux.NewRouter()
	cfg := config.New()

	ctx := context.Background()

	dbConn, err := database.NewPGXPool(ctx, cfg.DatabaseUrl)
	if err != nil {
		log.Fatalf("Failed to establish a database connection: %v", err)
	}
	defer dbConn.Close(ctx)
	err = database.RunMigrations(cfg)
	if err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	queries := database.New(dbConn)

	r.Use(middleware.LoggingMiddleware)

	r.HandleFunc("/", HomeHandler).Methods("GET")
	r.HandleFunc("/login", handlers.LoginHandler(cfg, queries)).Methods("POST")
	r.HandleFunc("/users", handlers.CreateUserHandler(cfg, queries)).Methods("POST")
	r.HandleFunc("/validate", ValidateTokenHandler).Methods("GET")
	r.Handle("/users/me", AuthMiddleware(handlers.GetMeUserHandler(cfg, queries))).Methods("GET", "OPTIONS")
	r.Handle("/accounts", AuthMiddleware(handlers.GetAccountsHandler(cfg, queries))).Methods("GET")
	r.Handle("/accounts", AuthMiddleware(handlers.CreateAccountHandler(cfg, queries))).Methods("POST")

	corsHandler := h.CORS(
		h.AllowedOrigins([]string{"http://localhost:5173"}),                   // Erlaube nur bestimmte Origin(s)
		h.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), // Erlaube Methoden
		h.AllowedHeaders([]string{"Content-Type", "Authorization"}),           // Erlaube Header
	)(r)

	log.Print("Running on 3000")
	log.Fatal(http.ListenAndServe(":3000", corsHandler))
}
