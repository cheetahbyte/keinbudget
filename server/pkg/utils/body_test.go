package utils_test

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/cheetahybte/keinbudget-backend/pkg/utils"
)

type SamplePayload struct {
	Message string `json:"message" validate:"required"`
	Count   int    `json:"count" validate:"required,gte=0"`
}

func TestParseJSON(t *testing.T) {
	tests := []struct {
		name       string
		body       interface{}
		expected   SamplePayload
		expectErr  bool
		errMessage string
	}{
		{
			name:       "valid JSON",
			body:       SamplePayload{Message: "Hello, World!", Count: 5},
			expected:   SamplePayload{Message: "Hello, World!", Count: 5},
			expectErr:  false,
			errMessage: "",
		},
		{
			name:       "empty body",
			body:       nil,
			expected:   SamplePayload{},
			expectErr:  true,
			errMessage: "request body is empty",
		},
		{
			name:       "invalid JSON",
			body:       "invalid JSON",
			expected:   SamplePayload{},
			expectErr:  true,
			errMessage: "failed to decode JSON body",
		},
		{
			name:       "missing field",
			body:       map[string]interface{}{"message": "Hello, World!"},
			expected:   SamplePayload{},
			expectErr:  true,
			errMessage: "validation error: Key: 'SamplePayload.Count' Error:Field validation for 'Count' failed on the 'required' tag",
		},
		{
			name:       "negative count",
			body:       map[string]interface{}{"message": "Hello, World!", "count": -1},
			expected:   SamplePayload{},
			expectErr:  true,
			errMessage: "validation error: Key: 'SamplePayload.Count' Error:Field validation for 'Count' failed on the 'gte' tag",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var body *bytes.Buffer
			if tt.body != nil {
				bodyBytes, _ := json.Marshal(tt.body)
				body = bytes.NewBuffer(bodyBytes)
			} else {
				body = bytes.NewBuffer([]byte{})
			}
			req := httptest.NewRequest("POST", "/", body)

			var result SamplePayload
			err := utils.ParseJSON(req, &result)
			if tt.expectErr {
				if err == nil {
					t.Fatalf("expected error, got nil")
				}
				if !strings.Contains(err.Error(), tt.errMessage) {
					t.Errorf("expected error message to contain %v, got %v", tt.errMessage, err.Error())
				}
			} else {
				if err != nil {
					t.Fatalf("expected no error, got %v", err)
				}
				if result != tt.expected {
					t.Errorf("expected %v, got %v", tt.expected, result)
				}
			}
		})
	}
}
