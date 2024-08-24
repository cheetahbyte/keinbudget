package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/cheetahybte/keinbudget-backend/config"
	"github.com/cheetahybte/keinbudget-backend/database"
	"github.com/cheetahybte/keinbudget-backend/handlers"
	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/auth"
	. "github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	gorillaHandlers "github.com/gorilla/handlers"
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
	WriteJSON(w, 200, user)
}

func main() {
	r := mux.NewRouter()
	config, _ := config.GetConfig()
	database.SetupDatabase(config)
	mhandler := middleware.MiddlewareHandler{DB: database.DB, DecodeJWTFunc: auth.DecodeJWT, Config: config}
	protected := r.PathPrefix("/").Subrouter()
	protected.Use(mhandler.AuthMiddleware)

	userHandler := handlers.UserHandler{DB: database.DB}
	protectedUserGroup := protected.PathPrefix("/users").Subrouter()
	protectedUserGroup.Use(mhandler.AuthMiddleware)
	userGroup := r.PathPrefix("/users").Subrouter()
	{
		userGroup.HandleFunc("/", userHandler.HandleAddUser).Methods(http.MethodPost)
		protectedUserGroup.HandleFunc("/me", userHandler.HandleGetOwnUser).Methods(http.MethodGet)
		userGroup.HandleFunc("/login", userHandler.HandleLoginUser).Methods(http.MethodPost)
	}

	protected.HandleFunc("/", testHandler)

	allowedOrigins := gorillaHandlers.AllowedOrigins(config.Cors.Origins)
	allowedMethods := gorillaHandlers.AllowedMethods(config.Cors.Methods)
	allowedHeaders := gorillaHandlers.AllowedHeaders(config.Cors.Headers)
	allowCredentials := gorillaHandlers.AllowCredentials()
	cors := gorillaHandlers.CORS(allowedOrigins, allowedHeaders, allowedMethods, allowCredentials)

	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%v", config.Addr, config.Port), cors(r)))
}
