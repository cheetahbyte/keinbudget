package tests

import (
	"bytes"
	"encoding/json"
	"keinbudget/server/src/database"
	"keinbudget/server/src/dto"
	"keinbudget/server/src/handlers"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_Create_ExternalAccount(t *testing.T) {
	app := SetupRouter()

	externalAccountsHandler := handlers.ExternalAccountsHandler{DB: database.DB}
	app.POST("/test", externalAccountsHandler.Create)

	data := dto.ExternalAccountCreate{
		Name: "test.name",
		Iban: "test.iban",
	}
	jsonData, _ := json.Marshal(data)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/test", bytes.NewBuffer(jsonData))

	app.ServeHTTP(w, req)
	assert.Equal(t, http.StatusCreated, w.Code)
}

func Test_Get_ExternalAccounts(t *testing.T) {
	app := SetupRouter()

	externalAccountsHandler := handlers.ExternalAccountsHandler{DB: database.DB}
	app.GET("/test", externalAccountsHandler.Get)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test", nil)

	app.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_Get_ExternalAccount_By_ID(t *testing.T) {
	app := SetupRouter()

	helper := TestHelper{DB: database.DB}
	externalAccount := helper.CreateExternalAccount(&dto.ExternalAccountCreate{
		Name: "test.name",
		Iban: "test.iban",
	})

	externalAccountsHandler := handlers.ExternalAccountsHandler{DB: database.DB}
	app.GET("/test/:id", externalAccountsHandler.GetById)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test/"+externalAccount.ID.String(), nil)

	app.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_Delete_ExternalAccount(t *testing.T) {
	app := SetupRouter()

	helper := TestHelper{DB: database.DB}
	externalAccount := helper.CreateExternalAccount(&dto.ExternalAccountCreate{
		Name: "test.name",
		Iban: "test.iban",
	})

	externalAccountsHandler := handlers.ExternalAccountsHandler{DB: database.DB}
	app.DELETE("/test/:id", externalAccountsHandler.Delete)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", "/test/"+externalAccount.ID.String(), nil)

	app.ServeHTTP(w, req)
	assert.Equal(t, http.StatusNoContent, w.Code)
}
