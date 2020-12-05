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
	c.Request.Header.Set("access_uuid", tokenId)
}

func (ctl AuthController) Refresh(c *gin.Context) {
	oldTokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error(getTokenError)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	token.DeleteById(tokenModel.ID)

	_, verifyRefreshTokenErr := auth.VerifyToken(c.Request, true)
	if verifyRefreshTokenErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}

	tokenDetails, createTokenErr := auth.CreateToken()
	if createTokenErr != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid refresh token"})
		c.Abort()
		return
	}
	c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid refresh token"})
	tokenModel.BranchId = oldTokenModel.BranchId
	tokenModel.Email = oldTokenModel.Email
	tokenModel.UserId = oldTokenModel.UserId
	tokenModel.OrgId = oldTokenModel.OrgId
	tokenModel.RoleId = oldTokenModel.RoleId
	tokenModel.AccessToken = tokenDetails.AccessToken
	tokenModel.RefreshToken = tokenDetails.RefreshToken
	tokenModel.ID = tokenDetails.AccessUUID
	_, tokenAddError := token.Add(tokenModel)
	if tokenAddError == nil {
		c.SetCookie("token", tokenDetails.AccessToken, 300, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{"message": "success"})
		c.Abort()
		return
	}
	c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid refresh token"})

}
