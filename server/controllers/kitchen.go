package controllers

import (
	"net/http"
	"strings"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type KitchenController struct{}

func (ctrl KitchenController) AddOrEdit(c *gin.Context) {
	var kitchenForm mappers.KitchenForm

	if c.ShouldBindJSON(&kitchenForm) != nil {
		logger.Error("invalid form ")

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}
	if !kitchenForm.Edit && kitchenForm.Password == "" {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "Invalid request"})
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

	if !helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId) {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if kitchenForm.Id == "" {
		//get kitchen role for current organisation
		roleModel, roleGetError := role.GetRoleByNameAndOrgId("kitchen", tokenModel.OrgId)
		if roleGetError != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}

		//add new user with kitchen role
		userModel.RoleId = roleModel.ID
		userModel.RoleName = roleModel.Name
		userModel.OrgId = tokenModel.OrgId
		userModel.ForgotPasswordCode = uuid.NewV4().String()
		userModel.BranchId = tokenModel.BranchId
		userModel.ID = uuid.NewV4().String()
	} else {
		var getUserError error
		userModel, getUserError = user.GetUserById(kitchenForm.Id)
		if getUserError != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	if kitchenForm.Password != "" {
		bytePassword := []byte(kitchenForm.Password)
		hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		userModel.Password = hashedPassword
	}
	userModel.Name = kitchenForm.Name
	userModel.UserName = kitchenForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(kitchenForm.UserName)
	config, getConfigError := configService.GetConfigByOrgId(tokenModel.BranchId)

	if getConfigError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userModel.Config = config
	_, userError := user.Register(userModel)

	if userError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl KitchenController) GetKitchens(c *gin.Context) {

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
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
	var kitchens []models.UserModel
	var error error
	if userRoleName == "admin" {
		kitchens, error = user.GetUsersByOrgIdAndRoleName(tokenModel.OrgId, "kitchen")
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	if userRoleName == "manager" {

		kitchens, error = user.GetUsersByBranchIdAndRoleName(tokenModel.BranchId, "kitchen")
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	if userRoleName == "kitchen" {
		kitchenModel, error := user.GetUserById(tokenModel.UserId)
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		kitchens = append(kitchens, kitchenModel)
	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": kitchens})

}

func (ctrl KitchenController) Delete(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	if !helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId) {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	kitchenId, gotKitchenId := c.GetQuery("id")

	if gotKitchenId {
		_, _ = user.DeleteById(kitchenId)
		c.JSON(http.StatusAccepted, gin.H{"message": "success"})
		c.Abort()
		return
	}
	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	c.Abort()
	return
}
