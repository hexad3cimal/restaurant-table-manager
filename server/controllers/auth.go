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
		if err.Error() == "token contains an invalid number of segments" {
			AuthController.Refresh(AuthController{}, c)
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	tokenId, err := auth.ExtractTokenMetadata(c.Request, false)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	c.Request.Header.Set("access_id", tokenId)
}

func (ctl AuthController) Refresh(c *gin.Context) {

	_, verifyRefreshTokenErr := auth.VerifyToken(c.Request, true)
	if verifyRefreshTokenErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		return
	}
	tokenId, err := auth.ExtractTokenMetadata(c.Request, true)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	tokenModel, getTokenError := token.GetTokenById(tokenId)
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	_, getUserErr := user.GetUserById(tokenModel.UserId)
	if getUserErr != nil {
		c.JSON(http.StatusForbidden, gin.H{"message": "Invalid authorization, please login again"})
		return
	}
	token, createErr := auth.CreateToken()
	if createErr != nil {
		c.JSON(http.StatusForbidden, gin.H{"message": "Invalid authorization, please login again"})
		return
	}

	c.SetCookie("token", token.AccessToken, 300, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{})

}
