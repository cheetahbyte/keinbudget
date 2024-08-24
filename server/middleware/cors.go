package middleware

import (
	"net/http"
	"strconv"
	"strings"
)

func (handler *MiddlewareHandler) CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowedOrigin := ""

		for _, o := range handler.Config.Cors.Origins {
			if o == origin || o == "*" {
				allowedOrigin = origin
				break
			}
		}

		if allowedOrigin != "" {
			w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "null")
		}

		// Set the allowed methods
		if len(handler.Config.Cors.Methods) > 0 {
			w.Header().Set("Access-Control-Allow-Methods", strings.Join(handler.Config.Cors.Methods, ", "))
		}

		// Set the allowed headers
		if len(handler.Config.Cors.Headers) > 0 {
			w.Header().Set("Access-Control-Allow-Headers", strings.Join(handler.Config.Cors.Headers, ", "))
		}

		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", strconv.Itoa(int(handler.Config.Cors.MaxAge)))

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
