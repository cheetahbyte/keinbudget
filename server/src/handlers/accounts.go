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
	c.JSON(http.StatusCreated, account)
}

func (handler *AccountsHandler) Get(c *gin.Context) {
	var accounts []models.Account
	// dont need to raise an error here as we will just return an empty array
	handler.DB.Find(&accounts)
	c.JSON(http.StatusOK, accounts)

}

func (handler *AccountsHandler) GetById(c *gin.Context) {
	id := c.Param("id")
	var account models.Account
	if err := handler.DB.Where("id = ?", id).First(&account).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}
	c.JSON(http.StatusOK, account)
}

func (handler *AccountsHandler) Update(c *gin.Context) {
	var account models.Account
	id := c.Param("id")
	if err := handler.DB.Where("id = ?", id).First(&account).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}
	// TODO: implement update
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented"})
}
