package handlers

import (
	"keinbudget/server/src/database/models"
	"keinbudget/server/src/dto"

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
		Name: accountData.Name,
		Iban: accountData.Iban,
	}

	handler.DB.Create(&account)
	c.JSON(200, gin.H{"account": account})
}
