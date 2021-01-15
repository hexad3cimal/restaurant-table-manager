package controllers

import (
	"net/http"
	"strings"
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

func (ctrl TagController) GetTags(c *gin.Context) {
	var tags []models.TagModel
	var error error
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
	if userRoleName == "admin" {
		tags, error = tag.GetByOrgId(tokenModel.OrgId)
	} else {
		tags, error = tag.GetByBranchId(tokenModel.OrgId)
	}
	if error == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tags})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}

func (ctrl TagController) GetSimilarTags(c *gin.Context) {

	branchId, gotBranchId := c.GetQuery("branchId")
	tagNames, gotTagName := c.GetQuery("tagName")

	if !gotBranchId || !gotTagName {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	var tags []models.TagModel
	var error error
	tagsString := strings.Split(tagNames, ",")
	for _, tagName := range tagsString {
		newTags, _ := tag.GetSimilarByNameAndBranchId(strings.ToLower(tagName), branchId)
		for _, selectedTag := range newTags {
			tags = append(tags, selectedTag)
		}
	}
	if error != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": tags})

}
