package handlers

import (
	"keinbudget/server/src/database/models"
	"keinbudget/server/src/dto"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AccountsHandler struct {
	DB *gorm.DB
}

func (handler *AccountsHandler) Create(c *gin.Context) {
	var accountData dto.AccountCreate
	if err := c.ShouldBindJSON(&accountData); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}
	account := models.Account{
		Name:            accountData.Name,
		Iban:            accountData.Iban,
		Balance:         accountData.Balance,
		StartingBalance: accountData.StartingBalance,
	}

	handler.DB.Create(&account)
	c.JSON(http.StatusCreated, gin.H{"account": account})
}

func (handler *AccountsHandler) Get(c *gin.Context) {
	var accounts []models.Account
	// dont need to raise an error here as we will just return an empty array
	handler.DB.Find(&accounts)
	c.JSON(http.StatusOK, gin.H{"accounts": accounts})

}
