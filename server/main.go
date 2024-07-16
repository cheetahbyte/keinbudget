package main

import (
	"log"
	"net/http"

	"github.com/cheetahybte/keinbudget-backend/config"
	"github.com/cheetahybte/keinbudget-backend/database"
	"github.com/cheetahybte/keinbudget-backend/handlers"
	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/auth"
	. "github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/gorilla/mux"
)

func testHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(middleware.UserTypeContextKeyString).(types.User)
	if !ok {
		problem := NewProblemDetails(
			WithStatus(http.StatusInternalServerError),
			WithDetail("The user provided by the auth middleware was malformed."),
			WithTitle("User was not found"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/user-not-found-middleware"),
		)
		WriteError(w, &problem)
		return
	}
	WriteJSON(w, 200, types.Map{"ok": user.Username})
}

func main() {
	r := mux.NewRouter()
	config, _ := config.GetConfig()
	database.SetupDatabase(config)
	mhandler := middleware.MiddlewareHandler{DB: database.DB, DecodeJWTFunc: auth.DecodeJWT}

	protected := r.PathPrefix("/").Subrouter()
	protected.Use(mhandler.AuthMiddleware)

	userHandler := handlers.UserHandler{DB: database.DB}
	userGroup := r.PathPrefix("/users").Subrouter()
	{
		userGroup.HandleFunc("/", userHandler.HandleAddUser).Methods(http.MethodPost)
		userGroup.HandleFunc("/login", userHandler.HandleLoginUser).Methods(http.MethodPost)
	}

	protected.HandleFunc("/", testHandler)

	log.Fatal(http.ListenAndServe(":8080", r))
}
