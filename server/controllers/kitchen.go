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

func (ctrl KitchenController) Add(c *gin.Context) {
	var kitchenForm mappers.RegisterForm

	if c.ShouldBindJSON(&kitchenForm) != nil {
		logger.Error("invalid form ")

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

	//get branch role for current organisation
	roleModel, roleGetError := role.GetRoleForOrg("kitchen", tokenModel.OrgId)
	if roleGetError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	//add new user with branch role
	userModel.RoleId = roleModel.ID
	userModel.OrgId = tokenModel.OrgId
	bytePassword := []byte(kitchenForm.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userModel.Name = kitchenForm.FullName
	userModel.UserName = kitchenForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(kitchenForm.UserName)

	userModel.Email = kitchenForm.Email
	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.BranchId = tokenModel.BranchId
	userModel.ID = uuid.NewV4().String()
	_, userError := user.Register(userModel)

	if userError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl KitchenController) GetBranchesOfOrg(c *gin.Context) {

	branches, err := branch.GetBranchesOfOrg(c.GetHeader("org_id"))
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}

func (ctrl KitchenController) GetBranches(c *gin.Context) {

	userRoleName, getRoleError := helpers.GetRoleName(c.GetHeader("user_id"), c.GetHeader("org_id"))

	hub := helpers.GetHub()
	helpers.EmitToSpecificClient(hub, helpers.SocketEventStruct{EventName: "message", EventPayload: "hello"}, c.GetHeader("user_id"))
	if getRoleError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	var branches []models.BranchModel
	var error error
	if userRoleName == "admin" {
		branches, error = branch.GetBranchesOfOrg(c.GetHeader("org_id"))
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	} else {

		currentUser, getCurrentUserError := user.GetUserById(c.GetHeader("user_id"))
		if getCurrentUserError != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		currentBranch, getCurrentBranchError := branch.Get(currentUser.BranchId)

		if getCurrentBranchError != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		branches = append(branches, currentBranch)

	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})

}
