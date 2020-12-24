package controllers

import (
	"net/http"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

type CategoryController struct{}

func (ctrl CategoryController) Add(c *gin.Context) {
	var categoryForm mappers.TypeForm

	if c.ShouldBindJSON(&categoryForm) != nil {
		logger.Error("inavlid category form ")

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
	categoryModel.OrgId = tokenModel.OrgId
	categoryModel.BranchId = categoryForm.BranchId
	categoryModel.ID = uuid.NewV4().String()
	_, categoryAddErr := category.Add(categoryModel)
	if categoryAddErr != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl CategoryController) GetTypesOfOrg(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	categories, err := category.GetByOrgId(tokenModel.OrgId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": categories})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}

func (ctrl CategoryController) GetTypes(c *gin.Context) {
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
	var categories []models.CategoryModel
	var error error
	if userRoleName == "admin" {
		categories, error = category.GetByOrgId(tokenModel.OrgId)
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}
	if userRoleName == "manager" {
		categories, error = category.GetByBranchId(tokenModel.OrgId)
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": categories})

}
