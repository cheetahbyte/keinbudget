package tests

import (
	"keinbudget/server/src/database"
	"keinbudget/server/src/database/models"
	"keinbudget/server/src/dto"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	app := gin.Default()
	database.SetupDatabase(":memory:")
	return app
}

type TestHelper struct {
	DB *gorm.DB
}

func (helper *TestHelper) CreateAccount(data *dto.AccountCreate) models.Account {
	account := models.Account{
		Name:            data.Name,
		Iban:            data.Iban,
		Balance:         data.Balance,
		StartingBalance: data.StartingBalance,
	}
	helper.DB.Create(&account)
	return account
}

func (helper *TestHelper) GetAccountById(id uuid.UUID) bool {
	var account models.Account
	helper.DB.Where("id = ?", id).First(&account)
	return account.ID != uuid.Nil
}
