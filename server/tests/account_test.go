package tests

import (
	"bytes"
	"keinbudget/server/src/database"
	"keinbudget/server/src/handlers"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/gofiber/fiber/v2"
	utils "github.com/gofiber/utils"
)

func Test_Create_Account_Handler(t *testing.T) {
	app := fiber.New()
	database.SetupDatabase(":memory:")
	accountsHandler := handlers.AccountsHandler{DB: database.DB}
	app.Post("/test", accountsHandler.Create)

	form := url.Values{}
	form.Add("name", "test.account")
	form.Add("iban", "test.iban")

	req := httptest.NewRequest("POST", "/test", bytes.NewBufferString(form.Encode()))
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := app.Test(req)
	utils.AssertEqual(t, nil, err, "app.Test")
	utils.AssertEqual(t, 200, resp.StatusCode, "Status code")
}
