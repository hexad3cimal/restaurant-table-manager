package controllers

import (
	"net/http"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

type TagController struct{}

func (ctrl TagController) Add(c *gin.Context) {
	var tagForm mappers.TagForm

	if c.ShouldBindJSON(&tagForm) != nil {
		logger.Error("inavlid tag form ")

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
	tagModel.OrgId = tokenModel.OrgId
	tagModel.BranchId = tagForm.BranchId
	tagModel.ProductId = tagForm.ProductId

	tagModel.ID = uuid.NewV4().String()
	_, tagAddErr := tag.Add(tagModel)
	if tagAddErr != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl TagController) GetTagsOfOrg(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	tags, err := tag.GetByOrgId(tokenModel.OrgId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tags})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}

func (ctrl TagController) GetTypes(c *gin.Context) {
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
	var tags []models.TagModel
	var error error
	if userRoleName == "admin" {
		tags, error = tag.GetByOrgId(tokenModel.OrgId)
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}
	if userRoleName == "manager" {
		tags, error = tag.GetByBranchId(tokenModel.BranchId)
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": tags})

}
