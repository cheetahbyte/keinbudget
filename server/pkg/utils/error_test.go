package utils_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cheetahybte/keinbudget/pkg/utils"
	"github.com/cheetahybte/keinbudget/types"
)

func TestWriteProblem(t *testing.T) {
	tests := []struct {
		name         string
		status       int
		problemType  string
		title        string
		detail       string
		instance     string
		expectedBody types.ProblemDetails
	}{
		{
			name:        "internal server error",
			status:      http.StatusInternalServerError,
			problemType: "https://example.com/internal-error",
			title:       "Internal Server Error",
			detail:      "something went wrong",
			instance:    "/test",
			expectedBody: types.ProblemDetails{
				Type:     "https://example.com/internal-error",
				Title:    "Internal Server Error",
				Status:   http.StatusInternalServerError,
				Detail:   "something went wrong",
				Instance: "/test",
			},
		},
		{
			name:        "not found error",
			status:      http.StatusNotFound,
			problemType: "https://example.com/not-found",
			title:       "Not Found",
			detail:      "resource not found",
			instance:    "/test/resource",
			expectedBody: types.ProblemDetails{
				Type:     "https://example.com/not-found",
				Title:    "Not Found",
				Status:   http.StatusNotFound,
				Detail:   "resource not found",
				Instance: "/test/resource",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()

			utils.WriteError(w, &types.ProblemDetails{
				Title:    tt.title,
				Detail:   tt.detail,
				Status:   tt.status,
				Instance: tt.instance,
				Type:     tt.problemType,
			})

			resp := w.Result()

			if resp.StatusCode != tt.status {
				t.Errorf("expected status %d, got %d", tt.status, resp.StatusCode)
			}

			contentType := resp.Header.Get("Content-Type")
			if contentType != "application/problem+json" {
				t.Errorf("expected Content-Type 'application/problem+json', got %s", contentType)
			}

			var problem types.ProblemDetails
			err := json.NewDecoder(resp.Body).Decode(&problem)
			if err != nil {
				t.Fatalf("failed to decode response body: %v", err)
			}

			if problem != tt.expectedBody {
				t.Errorf("expected body %+v, got %+v", tt.expectedBody, problem)
			}
		})
	}
}
