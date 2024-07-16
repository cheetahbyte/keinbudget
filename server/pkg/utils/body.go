package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/go-playground/validator/v10"
)

func ParseJSON(r *http.Request, payload any) error {
	validate := validator.New()
	defer r.Body.Close()

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		return fmt.Errorf("failed to read request body: %v", err)
	}

	if len(bodyBytes) == 0 {
		return fmt.Errorf("request body is empty")
	}

	// Unmarshal JSON into the actual payload
	if err := json.Unmarshal(bodyBytes, &payload); err != nil {
		return fmt.Errorf("failed to decode JSON body: %v", err)
	}
	// Validate the payload
	if err := validate.Struct(payload); err != nil {
		return fmt.Errorf("validation error: %v", err)
	}

	return nil
}

func WriteJSON(w http.ResponseWriter, status int, payload interface{}) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(payload)
}
