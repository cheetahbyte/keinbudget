package utils

import (
	"encoding/json"
	"net/http"

	"github.com/cheetahybte/keinbudget-backend/types"
)

func WriteError(w http.ResponseWriter, problem *types.ProblemDetails) {
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(problem.Status)
	json.NewEncoder(w).Encode(problem)
}

func NewProblemDetails(opts ...types.ProblemDetailOption) types.ProblemDetails {
	var problemDetails types.ProblemDetails

	for _, opt := range opts {
		opt(&problemDetails)
	}
	return problemDetails
}

func WithType(problemType string) types.ProblemDetailOption {
	return func(pd *types.ProblemDetails) {
		pd.Type = problemType
	}
}

func WithTitle(title string) types.ProblemDetailOption {
	return func(pd *types.ProblemDetails) {
		pd.Title = title
	}
}

func WithStatus(status int) types.ProblemDetailOption {
	return func(pd *types.ProblemDetails) {
		pd.Status = status
	}
}

func WithDetail(detail string) types.ProblemDetailOption {
	return func(pd *types.ProblemDetails) {
		pd.Detail = detail
	}
}

func WithInstance(instance string) types.ProblemDetailOption {
	return func(pd *types.ProblemDetails) {
		pd.Instance = instance
	}
}
