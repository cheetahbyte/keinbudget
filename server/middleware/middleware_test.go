package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cheetahybte/keinbudget-backend/middleware"
)

// Handler is a simple handler to test middleware
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Test Handler"))
}

// MiddlewareX adds a header to the response
func MiddlewareX(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Middleware", "MiddlewareX")
		next.ServeHTTP(w, r)
	})
}

// MiddlewareY adds a different header to the response
func MiddlewareY(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Y-Middleware", "MiddlewareY")
		next.ServeHTTP(w, r)
	})
}

// TestMiddlewareChain tests the chaining of middleware functions
func TestMiddlewareChain(t *testing.T) {
	handler := http.HandlerFunc(Handler)
	chain := middleware.Chain(MiddlewareX, MiddlewareY)(handler)

	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}

	rr := httptest.NewRecorder()
	chain.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	expected := "Test Handler"
	if rr.Body.String() != expected {
		t.Errorf("Handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
	}

	if header := rr.Header().Get("X-Middleware"); header != "MiddlewareX" {
		t.Errorf("Handler returned wrong X-Middleware header: got %v want %v", header, "MiddlewareX")
	}

	if header := rr.Header().Get("Y-Middleware"); header != "MiddlewareY" {
		t.Errorf("Handler returned wrong Y-Middleware header: got %v want %v", header, "MiddlewareY")
	}
}
