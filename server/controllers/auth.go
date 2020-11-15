package controllers

import (
	"fmt"
	"net/http"
	"table-booking/config"
	"table-booking/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AuthController struct{}

var authModel = new(models.AuthModel)

func (ctl AuthController) IstokenValid(c *gin.Context) {
	err := authModel.TokenValid(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	accessDetails, err := authModel.ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		c.Abort()
		return
	}
	c.Writer.Header().Set("orgId", accessDetails.OrgId)
	c.Writer.Header().Set("roleId", accessDetails.RoleId)
	c.Writer.Header().Set("userId", accessDetails.UserId)

}

func (ctl AuthController) Refresh(c *gin.Context) {

	refreshToken, err := c.Cookie("refresh-token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		return
	}

	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.GetConfig().Secret), nil
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		return
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		userID := fmt.Sprintf("%.f", claims["user_id"])
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
			return
		}
		user := userModel.GetUserById(userID)
		token, createErr := authModel.CreateToken(user)
		if createErr != nil {
			c.JSON(http.StatusForbidden, gin.H{"message": "Invalid authorization, please login again"})
			return
		}

		c.SetCookie("token", token.AccessToken, 300, "/", "localhost", false, true)

		c.JSON(http.StatusOK, gin.H{})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization, please login again"})
	}
}
