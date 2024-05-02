package handlers

import (
	"keinbudget/server/src/database/models"
	"keinbudget/server/src/dto"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ExternalAccountsHandler struct {
	DB *gorm.DB
}

func (handler *ExternalAccountsHandler) Create(c *gin.Context) {
	var externalAccountData dto.ExternalAccountCreate
	if err := c.ShouldBindJSON(&externalAccountData); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}
	externalAccount := models.ExternalAccount{
		Name: externalAccountData.Name,
		Iban: externalAccountData.Iban,
	}

	handler.DB.Create(&externalAccount)
	c.JSON(http.StatusCreated, externalAccount)
}

func (handler *ExternalAccountsHandler) Get(c *gin.Context) {
	var externalAccounts []models.ExternalAccount
	// dont need to raise an error here as we will just return an empty array
	handler.DB.Find(&externalAccounts)
	c.JSON(http.StatusOK, externalAccounts)

}

func (handler *ExternalAccountsHandler) GetById(c *gin.Context) {
	id := c.Param("id")
	var externalAccount models.ExternalAccount
	if err := handler.DB.Where("id = ?", id).First(&externalAccount).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ExternalAccount not found"})
		return
	}
	c.JSON(http.StatusOK, externalAccount)
}

func (handler *ExternalAccountsHandler) Update(c *gin.Context) {
	var externalAccount models.ExternalAccount
	id := c.Param("id")
	if err := handler.DB.Where("id = ?", id).First(&externalAccount).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ExternalAccount not found"})
		return
	}

	// TODO: implement update
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented"})
}

func (handler *ExternalAccountsHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	var externalAccount models.ExternalAccount
	if err := handler.DB.Where("id = ?", id).First(&externalAccount).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ExternalAccount not found"})
		return
	}

	handler.DB.Delete(&externalAccount)
	c.JSON(http.StatusNoContent, gin.H{})
}
