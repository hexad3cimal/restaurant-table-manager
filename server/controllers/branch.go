package controllers

import (
	"errors"
	"net/http"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type BranchController struct{}

var branch = new(models.Branch)
var branchModel models.BranchModel

func (ctrl BranchController) Add(c *gin.Context) {
	var branchForm mappers.BranchForm

	if c.ShouldBindJSON(&branchForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	branchModel.Address = branchForm.Address
	branchModel.Contact = branchForm.Contact
	branchModel.Email = branchForm.Email
	branchModel.Name = branchForm.Name
	branchModel.OrgId = c.GetHeader("org-id")
	branchModel.ID = uuid.NewV4().String()
	_, err := branch.Add(branchModel)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

	var user = new(models.User)
	var userModel models.UserModel
	userModel.RoleId = role.ID
	userModel.OrgId = addedOrganization.ID
	bytePassword := []byte(branchForm.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		//delete created admin role
		role
		//delete created organization
		org.DeleteById(addedOrganization.ID)
		return UserModel{}, errors.New("error occured while password hash generation")
	}

	user.Name = registerForm.FullName
	user.Email = registerForm.Email
	user.Password = hashedPassword
	user.ForgotPasswordCode = uuid.NewV4().String()
	user.ID = uuid.NewV4().String()
	_, userError := userModel.Register(user)

	if userError != nil {
		return BranchModel{}, userError
	}

}

func (ctrl BranchController) GetBranchesOfOrg(c *gin.Context) {
	branches, err := branchModel.GetBranchesOfOrg(c.GetHeader("orgId"))
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}
