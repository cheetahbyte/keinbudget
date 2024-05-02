package tests

import (
	"bytes"
	"encoding/json"
	"keinbudget/server/src/database"
	"keinbudget/server/src/database/models"
	"keinbudget/server/src/dto"
	"keinbudget/server/src/handlers"
	"net/http"
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
	assert.Equal(t, http.StatusCreated, w.Code)
}

func Test_Get_Accounts(t *testing.T) {
	app := SetupRouter()

	accountsHandler := handlers.AccountsHandler{DB: database.DB}
	app.GET("/test", accountsHandler.Get)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test", nil)

	app.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_Get_Account_By_ID(t *testing.T) {
	app := SetupRouter()

	helper := TestHelper{DB: database.DB}
	account := helper.CreateAccount(&dto.AccountCreate{
		Name: "test.name",
		Iban: "test.iban",
	})

	accountsHandler := handlers.AccountsHandler{DB: database.DB}
	app.GET("/test/:id", accountsHandler.GetById)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/test/"+account.ID.String(), nil)
	app.ServeHTTP(w, req)

	var createdAccount models.Account
	json.Unmarshal(w.Body.Bytes(), &createdAccount)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, account.ID, createdAccount.ID)
	assert.Equal(t, account.Name, createdAccount.Name)
}

func Test_Delete_Account_By_ID(t *testing.T) {
	app := SetupRouter()
	helper := TestHelper{DB: database.DB}
	account := helper.CreateAccount(&dto.AccountCreate{
		Name: "test.name",
		Iban: "test.iban",
	})

	accountsHandler := handlers.AccountsHandler{DB: database.DB}

	app.DELETE("/test/:id", accountsHandler.Delete)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", "/test/"+account.ID.String(), nil)
	app.ServeHTTP(w, req)

	stillExists := helper.GetAccountById(account.ID)

	assert.Equal(t, http.StatusNoContent, w.Code)
	assert.Equal(t, false, stillExists)
}
