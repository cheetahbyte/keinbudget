package tests

import (
	"bytes"
	"encoding/json"
	"keinbudget/server/src/database"
	"keinbudget/server/src/dto"
	"keinbudget/server/src/handlers"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_Create_Account_Handler(t *testing.T) {
	app := SetupRouter()

	accountsHandler := handlers.AccountsHandler{DB: database.DB}
	app.POST("/test", accountsHandler.Create)

	data := dto.AccountCreate{
		Name: "test.name",
		Iban: "test.iban",
	}
	jsonData, _ := json.Marshal(data)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/test", bytes.NewBuffer(jsonData))

	app.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)
}
