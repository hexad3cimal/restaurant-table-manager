package controllers

import (
	"net/http"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

type TypeController struct{}

func (ctrl TypeController) Add(c *gin.Context) {
	var typeForm mappers.TypeForm

	if c.ShouldBindJSON(&typeForm) != nil {
		logger.Error("inavlid branch form ")

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	typeModel.OrgId = tokenModel.OrgId
	typeModel.BranchId = typeForm.BranchId
	typeModel.ID = uuid.NewV4().String()
	_, typeAddErr := typeService.Add(typeModel)
	if typeAddErr != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl TypeController) GetTypesOfOrg(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	types, err := typeService.GetByOrgId(tokenModel.OrgId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": types})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}

func (ctrl TypeController) GetTypes(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	userRoleName, getRoleError := helpers.GetRoleName(tokenModel.UserId, tokenModel.OrgId)

	if getRoleError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	var types []models.FoodTypeModel
	var error error
	if userRoleName == "admin" {
		types, error = typeService.GetByOrgId(tokenModel.OrgId)
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}
	if userRoleName == "manager" {
		types, error = typeService.GetByBranchId(tokenModel.OrgId)
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": types})

}
