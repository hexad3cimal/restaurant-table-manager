package controllers

import (
	"net/http"
	"table-booking/helpers"

	"github.com/gin-gonic/gin"
)

type DashBoardController struct{}

func (ctrl DashBoardController) GetStats(c *gin.Context) {

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if !helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId) {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	roleName, roleNameGetError := helpers.GetRoleName(tokenModel.UserId, tokenModel.OrgId)
	if roleNameGetError != nil {
		logger.Error("Get rolename failed for " + tokenModel.UserId + " " + tokenModel.OrgId + " " + roleNameGetError.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if roleName == "admin" {
		stats, err := dashboard.GetStatsForOrg(tokenModel.OrgId)
		if err != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": stats})
		c.Abort()
		return
	}

	if roleName == "manager" {

		stats, err := dashboard.GetStatsForOrg(tokenModel.OrgId)
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"message": "success", "data": stats})
			c.Abort()
			return
		}
	}
	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
}
