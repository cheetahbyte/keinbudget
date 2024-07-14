package main

import (
	"log"
	"net/http"

	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/gorilla/mux"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s%s", r.Method, r.Host, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}

func BetaMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("BetaMiddleware")
		next.ServeHTTP(w, r)
	})
}

func AThirdMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("AThirdMiddleware")
		next.ServeHTTP(w, r)
	})
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

func main() {
	r := mux.NewRouter()
	r.Use(mux.MiddlewareFunc(middleware.Chain(LoggingMiddleware, BetaMiddleware)))

	protected := r.PathPrefix("/").Subrouter()

	api := protected.PathPrefix("/api").Subrouter()
	protected.Use(AThirdMiddleware)
	api.HandleFunc("/v1", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API v1"))
	}).Methods(http.MethodGet)

	r.HandleFunc("/", homeHandler).Methods(http.MethodGet)
	log.Fatal(http.ListenAndServe(":8080", r))
}
