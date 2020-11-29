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
	var branchForm mappers.RegisterForm

	if c.ShouldBindJSON(&branchForm) != nil {
		logger.Error("inavlid branch form ")

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	branchModel.Address = branchForm.Address
	branchModel.Contact = branchForm.Contact
	branchModel.Email = branchForm.Email
	branchModel.Name = branchForm.FullName
	branchModel.OrgId = c.GetHeader("org_id")
	branchModel.ID = uuid.NewV4().String()
	_, branchAddErr := branch.Add(branchModel)
	if branchAddErr != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	//get branch role for current organisation
	roleModel, roleGetError := role.GetRoleForOrg("manager", branchModel.OrgId)
	if roleGetError != nil {
		branch.DeleteBranchById(branchModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	//add new user with branch role
	userModel.RoleId = roleModel.ID
	userModel.OrgId = branchModel.OrgId
	bytePassword := []byte(branchForm.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		branch.DeleteBranchById(branchModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userModel.Name = branchForm.FullName
	userModel.UserName = branchForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(branchForm.UserName)

	userModel.Email = branchForm.Email
	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.BranchId = branchModel.ID
	userModel.ID = uuid.NewV4().String()
	_, userError := user.Register(userModel)

	if userError != nil {
		branch.DeleteBranchById(branchModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl BranchController) GetBranchesOfOrg(c *gin.Context) {
	branches, err := branch.GetBranchesOfOrg(c.GetHeader("org_id"))
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}

func (ctrl BranchController) GetBranches(c *gin.Context) {

	userRoleName, getRoleError := helpers.GetRoleName(c.GetHeader("user_id"), c.GetHeader("org_id"))

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
