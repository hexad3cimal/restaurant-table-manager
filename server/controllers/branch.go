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

type BranchController struct{}

func (ctrl BranchController) Add(c *gin.Context) {
	var branchForm mappers.BranchForm

	if c.ShouldBindJSON(&branchForm) != nil {
		logger.Error("inavlid branch form ")

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	userModel.Address = branchForm.Address
	userModel.Contact = branchForm.Contact
	userModel.Name = branchForm.Name
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userModel.OrgId = tokenModel.OrgId
	userModel.ID = uuid.NewV4().String()

	//get branch role for current organisation
	roleModel, roleGetError := role.GetRoleByNameAndOrgId("manager", tokenModel.OrgId)
	if roleGetError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	//add new user with branch role
	userModel.RoleId = roleModel.ID
	userModel.RoleName = roleModel.Name
	bytePassword := []byte(branchForm.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userModel.UserName = branchForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(branchForm.UserName)

	userModel.Email = branchForm.Email
	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.BranchId = uuid.NewV4().String()
	branchUserModel, userError := user.Register(userModel)

	if userError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	//get branch role for current organisation
	kitchenRoleModel, kitchenRoleGetError := role.GetRoleByNameAndOrgId("kitchen", tokenModel.OrgId)
	if kitchenRoleGetError != nil {
		user.DeleteById(userModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	userModel.Name = branchForm.Name
	userModel.UserName = branchForm.UserName + "-kitchen"
	userModel.UserNameLowerCase = strings.ToLower(userModel.UserName)
	userModel.RoleId = kitchenRoleModel.ID
	userModel.RoleName = kitchenRoleModel.Name
	userModel.Email = branchForm.Email
	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.BranchId = branchUserModel.ID
	userModel.ID = uuid.NewV4().String()
	_, kitchenUserError := user.Register(userModel)
	if kitchenUserError != nil {
		user.DeleteById(branchUserModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl BranchController) GetBranchesOfOrg(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	branches, err := user.GetUsersByOrgId(tokenModel.OrgId, "manager")
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}

func (ctrl BranchController) GetBranches(c *gin.Context) {
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
	var branches []models.UserModel
	var error error
	if userRoleName == "admin" {
		branches, error = user.GetUsersByOrgId(tokenModel.OrgId, "manager")
		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	} else {

		currentUser, getCurrentUserError := user.GetUserById(tokenModel.UserId)
		if getCurrentUserError != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		branches = append(branches, currentUser)

	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})

}
