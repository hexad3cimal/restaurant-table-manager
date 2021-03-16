package controllers

import (
	"net/http"
	"table-booking/helpers"
	"table-booking/mappers"

	"github.com/gin-gonic/gin"
)

type ConfigController struct{}

func (ctrl ConfigController) Add(c *gin.Context) {
	var configForm mappers.ConfigForm

	if c.ShouldBindJSON(&configForm) != nil {
		logger.Error("invalid configForm form ")

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	configModel, _ := configService.GetConfigByOrgId(tokenModel.OrgId)
	configModel.OrgId = tokenModel.OrgId
	configModel.TimeZone = configForm.TimeZone
	configModel.Currency = configForm.Currency
	configModel.Country = configForm.Country
	configModel.PrinterEnabled = configForm.PrinterEnabled
	configModel.Language = configForm.Language

	_, configModelAddErr := configService.Add(configModel)
	if configModelAddErr != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl ConfigController) GetConfig(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	var searchId string
	userRoleName, getRoleError := helpers.GetRoleName(tokenModel.UserId, tokenModel.OrgId)

	if getRoleError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	if userRoleName == "admin" {
		searchId = tokenModel.OrgId
	} else {
		searchId = tokenModel.BranchId
	}
	config, getConfigError := configService.GetConfigByOrgId(searchId)

	if getConfigError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return

	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": config})

}

func (ctrl ConfigController) GetCurrencies(c *gin.Context) {

	currencies, getCurrenciesError := configService.GetCurrencies()

	if getCurrenciesError != nil {
		logger.Error(getCurrenciesError)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": currencies})

}

func (ctrl ConfigController) GetTimezones(c *gin.Context) {

	tzs := helpers.GetTimeZones()

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": tzs})

}
