package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct{}

func (ctl AuthController) IstokenValid(c *gin.Context) {
	err := auth.TokenValid(c.Request, false)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	accessDetails, err := auth.ExtractTokenMetadata(c.Request, false)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	c.Request.Header.Set("org_id", accessDetails.OrgId)
	c.Request.Header.Set("role_id", accessDetails.RoleId)
	c.Request.Header.Set("user_id", accessDetails.UserId)
}

func (ctl AuthController) Refresh(c *gin.Context) {

	_, verifyRefreshTokenErr := auth.VerifyToken(c.Request, true)
	if verifyRefreshTokenErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		return
	}
	accessDetails, err := auth.ExtractTokenMetadata(c.Request, true)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	user, getUserErr := user.GetUserById(accessDetails.UserId)
	if getUserErr != nil {
		c.JSON(http.StatusForbidden, gin.H{"message": "Invalid authorization, please login again"})
		return
	}
	token, createErr := auth.CreateToken(user.ID, user.RoleId, user.OrgId)
	if createErr != nil {
		c.JSON(http.StatusForbidden, gin.H{"message": "Invalid authorization, please login again"})
		return
	}

	c.SetCookie("token", token.AccessToken, 300, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{})

}
