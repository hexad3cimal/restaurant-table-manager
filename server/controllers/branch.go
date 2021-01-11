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

func (ctrl BranchController) AddOrEdit(c *gin.Context) {
	var branchForm mappers.BranchForm
	if c.ShouldBindJSON(&branchForm) != nil {
		logger.Error("invalid branch form ", c.ShouldBindJSON(&branchForm))

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid request"})
		c.Abort()
		return
	}
	if !branchForm.Edit && branchForm.Password == "" {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "Invalid request"})
		c.Abort()
		return
	}
	if branchForm.Edit {
		userModel, _ = user.GetUserById(branchForm.Id)
	} else {
		userModel.ID = uuid.NewV4().String()
		userModel.ForgotPasswordCode = uuid.NewV4().String()
		userModel.BranchId = uuid.NewV4().String()
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
	if branchForm.Edit {
		userModel.ID = branchForm.Id
		userModel.BranchId = branchForm.BranchId
	} else {
		userModel.ID = uuid.NewV4().String()
		userModel.ForgotPasswordCode = uuid.NewV4().String()
		userModel.BranchId = uuid.NewV4().String()
	}

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
	if branchForm.Password != "" {
		bytePassword := []byte(branchForm.Password)
		hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		userModel.Password = hashedPassword
	}

	userModel.UserName = branchForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(branchForm.UserName)

	userModel.Email = branchForm.Email

	branchUserModel, userError := user.Register(userModel)

	if userError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if !branchForm.Edit {
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
		userModel.Password = branchUserModel.Password
		userModel.ForgotPasswordCode = uuid.NewV4().String()
		userModel.BranchId = branchUserModel.BranchId
		userModel.ID = uuid.NewV4().String()
		_, kitchenUserError := user.Register(userModel)
		if kitchenUserError != nil {
			user.DeleteById(branchUserModel.ID)
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl BranchController) Delete(c *gin.Context) {
	branchId, gotBranchId := c.GetQuery("id")

	if gotBranchId == true {
		_, _ = user.DeleteByBranchId(branchId)
		c.JSON(http.StatusAccepted, gin.H{"message": "success"})
		c.Abort()
		return
	}
	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	c.Abort()
	return
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
